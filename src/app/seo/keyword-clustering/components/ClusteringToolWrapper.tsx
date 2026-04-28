'use client'

import dynamic from 'next/dynamic'

export const ClusteringToolWrapper = dynamic(() => import('./ClusteringTool').then(mod => mod.ClusteringTool), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center">
      <div className="text-neutral-400 font-medium">Loading Clustering Engine...</div>
    </div>
  )
})
