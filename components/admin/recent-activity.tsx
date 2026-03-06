import React from 'react'

type RecentActivityItem = {
    id: string
    user: string
    action: string
    time: string
}

function pickColor(initial: string) {
    const colors = [
        'bg-blue-100 text-blue-600',
        'bg-emerald-100 text-emerald-600',
        'bg-amber-100 text-amber-600',
        'bg-purple-100 text-purple-600',
        'bg-zinc-100 text-zinc-600',
    ]
    return colors[initial.charCodeAt(0) % colors.length]
}

export function RecentActivity({ acts }: { acts: RecentActivityItem[] }) {
    return (
        <div className="space-y-8">
            {acts.map((act) => (
                <div key={act.id} className="flex items-center">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full font-medium ${pickColor(act.user.charAt(0).toUpperCase())}`}>
                        {act.user.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{act.user}</p>
                        <p className="text-sm text-muted-foreground">{act.action}</p>
                    </div>
                    <div className="ml-auto font-medium text-xs text-muted-foreground">
                        {act.time}
                    </div>
                </div>
            ))}
        </div>
    )
}
