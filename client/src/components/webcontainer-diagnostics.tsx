"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Terminal } from "lucide-react"

interface DiagnosticsProps {
  webcontainer: any
  previewUrl: string | null
  serverReady: boolean
}

export function WebContainerDiagnostics({ webcontainer, previewUrl, serverReady }: DiagnosticsProps) {
  const [diagnostics, setDiagnostics] = useState({
    sharedArrayBuffer: typeof SharedArrayBuffer !== "undefined",
    crossOriginIsolation: false,
    webcontainerBooted: !!webcontainer,
    serverRunning: serverReady,
    urlAccessible: false,
  })

  const [isChecking, setIsChecking] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs((prev) => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const checkCrossOriginIsolation = () => {
    // Check if we have the required headers
    const coopHeader = document.querySelector('meta[http-equiv="Cross-Origin-Opener-Policy"]')
    const coepHeader = document.querySelector('meta[http-equiv="Cross-Origin-Embedder-Policy"]')

    return !!(coopHeader && coepHeader) || window.crossOriginIsolated
  }

  const checkUrlAccessibility = async (url: string) => {
    try {
      const response = await fetch(url, {
        method: "HEAD",
        mode: "no-cors",
        signal: AbortSignal.timeout(5000),
      })
      return true
    } catch (error) {
      addLog(`URL check failed: ${error}`)
      return false
    }
  }

  const runDiagnostics = async () => {
    setIsChecking(true)
    addLog("Running diagnostics...")

    const newDiagnostics = {
      sharedArrayBuffer: typeof SharedArrayBuffer !== "undefined",
      crossOriginIsolation: checkCrossOriginIsolation(),
      webcontainerBooted: !!webcontainer,
      serverRunning: serverReady,
      urlAccessible: false,
    }

    if (previewUrl) {
      addLog(`Checking URL accessibility: ${previewUrl}`)
      newDiagnostics.urlAccessible = await checkUrlAccessibility(previewUrl)
    }

    setDiagnostics(newDiagnostics)
    addLog("Diagnostics complete")
    setIsChecking(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [webcontainer, previewUrl, serverReady])

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />
  }

  const getStatusBadge = (status: boolean) => {
    return <Badge variant={status ? "default" : "destructive"}>{status ? "OK" : "FAIL"}</Badge>
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              WebContainer Diagnostics
            </span>
            <Button variant="outline" size="sm" onClick={runDiagnostics} disabled={isChecking}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-2">
                {getStatusIcon(diagnostics.sharedArrayBuffer)}
                <span className="text-sm font-medium">SharedArrayBuffer Support</span>
              </div>
              {getStatusBadge(diagnostics.sharedArrayBuffer)}
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-2">
                {getStatusIcon(diagnostics.crossOriginIsolation)}
                <span className="text-sm font-medium">Cross-Origin Isolation</span>
              </div>
              {getStatusBadge(diagnostics.crossOriginIsolation)}
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-2">
                {getStatusIcon(diagnostics.webcontainerBooted)}
                <span className="text-sm font-medium">WebContainer Booted</span>
              </div>
              {getStatusBadge(diagnostics.webcontainerBooted)}
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-2">
                {getStatusIcon(diagnostics.serverRunning)}
                <span className="text-sm font-medium">Dev Server Running</span>
              </div>
              {getStatusBadge(diagnostics.serverRunning)}
            </div>

            {previewUrl && (
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  {getStatusIcon(diagnostics.urlAccessible)}
                  <span className="text-sm font-medium">Preview URL Accessible</span>
                </div>
                {getStatusBadge(diagnostics.urlAccessible)}
              </div>
            )}
          </div>

          {(!diagnostics.sharedArrayBuffer || !diagnostics.crossOriginIsolation) && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                WebContainer requires SharedArrayBuffer and Cross-Origin Isolation. Make sure your server is configured
                with the proper headers:
                <br />
                <code className="text-xs">Cross-Origin-Opener-Policy: same-origin</code>
                <br />
                <code className="text-xs">Cross-Origin-Embedder-Policy: require-corp</code>
              </AlertDescription>
            </Alert>
          )}

          {previewUrl && (
            <div className="p-3 bg-muted rounded text-xs font-mono break-all">
              <strong>Preview URL:</strong> {previewUrl}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Diagnostic Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black text-green-400 p-3 rounded font-mono text-xs h-32 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet...</div>
            ) : (
              logs.map((log, index) => <div key={index}>{log}</div>)
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
