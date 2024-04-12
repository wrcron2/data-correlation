import React from 'react'
import './style.css'

interface OverviewProps {
    selected: string
}

export const Overview:React.FC<OverviewProps> = ({ selected }) => {
    return (
        <div className='overview-root'>
            Current App: {selected}
        </div>
    )
}