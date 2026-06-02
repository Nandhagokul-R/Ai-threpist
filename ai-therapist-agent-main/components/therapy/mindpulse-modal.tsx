"use client";

import { useState, useEffect } from "react";
import { Activity } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function MindPulseModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [iframeHeight, setIframeHeight] = useState("600px");

  useEffect(() => {
    // Simulate loading time for smooth transition
    if (open) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setLoading(true);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-transparent border-none">
        <DialogHeader className="sr-only">
          <DialogTitle>MindPulse AI Assistant</DialogTitle>
        </DialogHeader>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-[600px] w-full bg-background/95 backdrop-blur-sm rounded-lg border border-primary/10"
            >
              <Activity className="h-12 w-12 text-purple-500 animate-pulse" />
              <h3 className="mt-4 text-xl font-semibold bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">
                Loading MindPulse
              </h3>
              <div className="mt-4 w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <iframe
                src="http://localhost:8501"
                title="MindPulse AI"
                className="w-full rounded-lg"
                style={{ height: iframeHeight }}
                onLoad={() => setIframeHeight("80vh")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}