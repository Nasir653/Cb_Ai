import React from 'react'
import DatabaseSchema from './db-schema-main-content'

export default function page() {
    return (

        <div className='relative flex h-full max-w-full flex-1 flex-col overflow-hidden'>

            <DatabaseSchema />

        </div>

    )
}
