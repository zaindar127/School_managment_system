import { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import React from "react"

interface ReportCardProps {
  title: string
  description: string
  icon: LucideIcon
  children: ReactNode
}

export function ReportCard({ title, description, icon: Icon, children }: ReportCardProps) {
  // Find the last child (button) and wrap other children separately
  const childrenArray = React.Children.toArray(children);
  const lastChild = childrenArray.length > 0 ? childrenArray[childrenArray.length - 1] : null;
  const otherChildren = childrenArray.slice(0, childrenArray.length - 1);
  
  return (
    <Card className="border border-border hover:shadow-md transition-all duration-300 hover:border-primary/20 overflow-hidden flex flex-col h-full">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="space-y-4 p-5 flex-1">
          {otherChildren}
        </div>
        {lastChild && (
          <div className="mt-auto p-5 pt-0">
            {lastChild}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 