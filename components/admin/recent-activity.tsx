import React from 'react'

const acts = [
    { id: 1, user: 'Sophie M.', action: 'a acheté le service "Design Pro"', time: 'Il y a 2h', initial: 'S', color: 'bg-blue-100 text-blue-600' },
    { id: 2, user: 'John D.', action: 's\'est inscrit', time: 'Il y a 4h', initial: 'J', color: 'bg-emerald-100 text-emerald-600' },
    { id: 3, user: 'Alice', action: 'a posté une review (5 étoiles)', time: 'Il y a 5h', initial: 'A', color: 'bg-amber-100 text-amber-600' },
    { id: 4, user: 'Creative Studio', action: 'a publié un nouveau service', time: 'Hier', initial: 'C', color: 'bg-purple-100 text-purple-600' },
    { id: 5, user: 'Marc K.', action: 'a mis à jour son profil', time: 'Hier', initial: 'M', color: 'bg-zinc-100 text-zinc-600' },
]

export function RecentActivity() {
    return (
        <div className="space-y-8">
            {acts.map((act) => (
                <div key={act.id} className="flex items-center">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full font-medium ${act.color}`}>
                        {act.initial}
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
