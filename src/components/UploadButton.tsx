"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"

const UploadButton = () => {
    const [isOpen, setIsOpen] = useState(false)
  return (
      <Dialog open={isOpen} onOpenChange={(visible) => {
          if(!visible) setIsOpen(visible)
      }}>
          <DialogTrigger onClick={() => setIsOpen(true)} asChild>
              <Button>Upload PDF</Button>
          </DialogTrigger>
          <DialogContent>Hello everyone</DialogContent>
    </Dialog>
  )
}

export default UploadButton