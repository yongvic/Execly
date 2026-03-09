import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { promises as fs } from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

const ADMIN_ROLES = new Set(['ADMIN', 'SUPER_ADMIN', 'MODERATOR'])

const updateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  deliverableUrl: z.string().url().nullable().optional(),
})

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    const role = session?.role?.toString().toUpperCase()
    if (!session?.id || !role || !ADMIN_ROLES.has(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const contentType = request.headers.get('content-type') || ''

    let nextStatus: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | undefined
    let nextDeliverableUrl: string | null | undefined

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const rawStatus = formData.get('status')
      const rawUrl = formData.get('deliverableUrl')
      const rawFile = formData.get('deliverableFile')

      if (typeof rawStatus === 'string' && rawStatus.trim().length > 0) {
        const parsedStatus = z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).safeParse(rawStatus)
        if (!parsedStatus.success) {
          return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
        }
        nextStatus = parsedStatus.data
      }

      if (typeof rawUrl === 'string') {
        const trimmedUrl = rawUrl.trim()
        if (trimmedUrl.length > 0) {
          const parsedUrl = z.string().url().safeParse(trimmedUrl)
          if (!parsedUrl.success) {
            return NextResponse.json({ error: 'Invalid deliverable URL' }, { status: 400 })
          }
          nextDeliverableUrl = trimmedUrl
        }
      }

      if (!nextDeliverableUrl && rawFile instanceof File && rawFile.size > 0) {
        const safeBaseName = sanitizeFileName(rawFile.name || 'deliverable')
        const finalFileName = `${id}_${Date.now()}_${safeBaseName}`
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'deliverables')
        const fullFilePath = path.join(uploadDir, finalFileName)

        await fs.mkdir(uploadDir, { recursive: true })
        const arrayBuffer = await rawFile.arrayBuffer()
        await fs.writeFile(fullFilePath, Buffer.from(arrayBuffer))
        nextDeliverableUrl = `/uploads/deliverables/${finalFileName}`
      }
    } else {
      const body = await request.json()
      const parsed = updateSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
      }
      nextStatus = parsed.data.status
      if (Object.prototype.hasOwnProperty.call(parsed.data, 'deliverableUrl')) {
        nextDeliverableUrl = parsed.data.deliverableUrl ?? null
      }
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        ...(nextStatus ? { status: nextStatus } : {}),
        ...(typeof nextDeliverableUrl !== 'undefined'
          ? { deliverableUrl: nextDeliverableUrl }
          : {}),
      },
      include: {
        user: { select: { name: true, email: true } },
        service: { select: { name: true } },
        payment: true,
      },
    })

    return NextResponse.json({ order: updated }, { status: 200 })
  } catch (error) {
    console.error('Admin orders PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
