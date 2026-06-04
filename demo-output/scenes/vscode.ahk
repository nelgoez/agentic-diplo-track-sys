; AutoHotkey v2 script — Simulates VS Code coding session
; Opens DTS project, navigates files, types code
; Invoked by orchestrator.ts via: AutoHotkey64.exe scenes/vscode.ahk

#Requires AutoHotkey v2.0
#SingleInstance Force
SetWorkingDir A_ScriptDir "\..\.."

; --- Configuration ---
dtsRoot := "D:\Nahuel\Proyectos\UPEX\diploma-tracking-sys"
vscodeExe := "code"

; --- Focus & activate VS Code ---
if WinExist("ahk_exe Code.exe") {
    WinActivate("ahk_exe Code.exe")
} else {
    Run(vscodeExe . " " . dtsRoot)
    WinWait("ahk_exe Code.exe", , 15)
    if !WinExist("ahk_exe Code.exe") {
        MsgBox("VS Code did not open in time. Aborting.")
        ExitApp(1)
    }
    WinActivate("ahk_exe Code.exe")
}

Sleep(2000)

; --- Open file 1: rule-engine.ts ---
Send("^p")                           ; Ctrl+P = Quick Open
Sleep(500)
Send("rule-engine.ts")
Sleep(400)
Send("{Enter}")
Sleep(1000)

; Simulate scrolling through code
Send("{PgDn}")
Sleep(300)
Send("{PgDn}")
Sleep(300)
Send("{PgUp}")
Sleep(300)

; --- Open file 2: enrollments.ts ---
Send("^p")
Sleep(400)
Send("enrollments.ts")
Sleep(300)
Send("{Enter}")
Sleep(800)

; Navigate and "type" some code
Send("{Down 5}")
Sleep(200)
Send("{End}")
Sleep(100)
Send("{Enter}")
Sleep(300)
Send("{Tab}const eligible = await ruleEngine.evaluate(studentId, trackId);")
Sleep(600)
Send("{Enter}")
Sleep(200)
Send("{Tab}if (!eligible) return c.json({ error: 'Not eligible' }, 403);")
Sleep(600)

; --- Open file 3: resilient-adapter.ts ---
Send("^p")
Sleep(400)
Send("resilient-adapter.ts")
Sleep(300)
Send("{Enter}")
Sleep(800)

; Scroll
Send("{PgDn}")
Sleep(300)
Send("{PgUp}")
Sleep(300)

; --- Open file 4: rules.ts ---
Send("^p")
Sleep(400)
Send("routes/rules.ts")
Sleep(300)
Send("{Enter}")
Sleep(800)

; Show terminal
Send("^j")                           ; Toggle panel (terminal)
Sleep(800)

; --- Done ---
Sleep(1000)
ExitApp(0)
