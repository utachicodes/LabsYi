'use client';

import React, { useRef, useState, useEffect } from 'react';
import Editor, { useMonaco, type OnMount } from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  readOnly?: boolean;
}

const TEMPLATES: Record<string, string> = {
  python: `# LabsYi Robot Control Script
# ─────────────────────────────────────────

import time

def main():
    """Entry point — connect and run robot commands."""
    print("[INFO] Connecting to robot...")

    # Example: teleoperation sequence
    move_to(x=0.3, y=0.0, z=0.4)
    time.sleep(0.5)

    open_gripper()
    time.sleep(0.3)

    move_to(x=0.3, y=0.1, z=0.3)
    close_gripper()

    print("[OK] Task complete")

def move_to(x: float, y: float, z: float):
    """Move end-effector to Cartesian position (metres)."""
    print(f"  → Moving to ({x:.3f}, {y:.3f}, {z:.3f})")

def open_gripper():
    print("  → Gripper OPEN")

def close_gripper():
    print("  → Gripper CLOSE")

if __name__ == "__main__":
    main()
`,
  cpp: `// LabsYi Robot Control — C++
// ─────────────────────────────────────────
#include <iostream>
#include <chrono>
#include <thread>

struct Vec3 { double x, y, z; };

void move_to(Vec3 pos) {
    std::cout << "  → Moving to ("
              << pos.x << ", " << pos.y << ", " << pos.z << ")\n";
}

void open_gripper()  { std::cout << "  → Gripper OPEN\n"; }
void close_gripper() { std::cout << "  → Gripper CLOSE\n"; }

int main() {
    std::cout << "[INFO] Robot script started\n";
    move_to({0.3, 0.0, 0.4});
    std::this_thread::sleep_for(std::chrono::milliseconds(500));
    open_gripper();
    move_to({0.3, 0.1, 0.3});
    close_gripper();
    std::cout << "[OK] Task complete\n";
    return 0;
}
`,
  javascript: `// LabsYi Robot Control — JavaScript
// ─────────────────────────────────────────

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function moveTo(x, y, z) {
  console.log(\`  → Moving to (\${x}, \${y}, \${z})\`);
  await sleep(300);
}

async function openGripper()  { console.log('  → Gripper OPEN');  await sleep(200); }
async function closeGripper() { console.log('  → Gripper CLOSE'); await sleep(200); }

async function main() {
  console.log('[INFO] Robot script started');
  await moveTo(0.3, 0.0, 0.4);
  await openGripper();
  await moveTo(0.3, 0.1, 0.3);
  await closeGripper();
  console.log('[OK] Task complete');
}

main();
`,
};

const LANG_OPTIONS = [
  { label: 'Python',     value: 'python'     },
  { label: 'C++',        value: 'cpp'        },
  { label: 'JavaScript', value: 'javascript' },
];

export default function CodeEditor({ value, onChange, readOnly = false }: CodeEditorProps) {
  const editorRef               = useRef<Parameters<OnMount>[0] | null>(null);
  const [language, setLanguage] = useState('python');
  const monaco                  = useMonaco();

  /* Register a custom dark cyber theme once Monaco is loaded */
  useEffect(() => {
    if (!monaco) return;
    monaco.editor.defineTheme('labsyi-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment',   foreground: '4a5568', fontStyle: 'italic' },
        { token: 'keyword',   foreground: '38bdf8', fontStyle: 'bold'   },
        { token: 'string',    foreground: '34d399'                       },
        { token: 'number',    foreground: 'fbbf24'                       },
        { token: 'type',      foreground: 'a78bfa'                       },
        { token: 'function',  foreground: 'f0abfc'                       },
        { token: 'variable',  foreground: 'e2e8f0'                       },
        { token: 'operator',  foreground: '94a3b8'                       },
      ],
      colors: {
        'editor.background':              '#080f1c',
        'editor.foreground':              '#e2e8f0',
        'editorLineNumber.foreground':    '#2d3748',
        'editorLineNumber.activeForeground': '#38bdf8',
        'editor.lineHighlightBackground': '#0d1a2e',
        'editor.selectionBackground':     '#1e3a5f',
        'editorCursor.foreground':        '#38bdf8',
        'editor.inactiveSelectionBackground': '#132030',
        'editorWidget.background':        '#0d1a2e',
        'editorWidget.border':            '#1e3a5f',
        'editorSuggestWidget.background': '#0d1526',
        'editorSuggestWidget.border':     '#1e3a5f',
        'editorSuggestWidget.selectedBackground': '#1e3a5f',
        'scrollbarSlider.background':     '#1e3a5f88',
        'scrollbarSlider.hoverBackground':'#38bdf844',
        'minimap.background':             '#060e1b',
      },
    });
    // setTheme is an imperative Monaco API call — not a React state update
    monaco.editor.setTheme('labsyi-dark');
  }, [monaco]);

  /* When language changes, if value is empty/template, swap to new template */
  const handleLangChange = (lang: string) => {
    setLanguage(lang);
    const currentIsTemplate = Object.values(TEMPLATES).includes(value);
    if (!value || currentIsTemplate) {
      onChange(TEMPLATES[lang]);
    }
  };

  const initialValue = value || TEMPLATES[language];

  return (
    <div className="w-full h-full flex flex-col bg-[#080f1c] overflow-hidden">
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-sky-400/10 bg-[#060e1b] shrink-0">
        {/* Language pills */}
        <div className="flex gap-1">
          {LANG_OPTIONS.map((l) => (
            <button
              key={l.value}
              onClick={() => handleLangChange(l.value)}
              className={`px-2.5 py-0.5 rounded text-xs terminal-text transition-all ${
                language === l.value
                  ? 'bg-sky-400/15 border border-sky-400/30 text-sky-400'
                  : 'text-slate-600 hover:text-slate-400'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* File name indicator */}
        <span className="text-xs terminal-text text-slate-700">
          robot_script.{language === 'cpp' ? 'cpp' : language === 'javascript' ? 'js' : 'py'}
        </span>

        {/* Reset template */}
        <button
          onClick={() => onChange(TEMPLATES[language])}
          className="text-xs terminal-text text-slate-700 hover:text-slate-400 transition-colors px-2 py-0.5"
        >
          Reset
        </button>
      </div>

      {/* ── Monaco editor ── */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          value={initialValue}
          onChange={onChange}
          theme="labsyi-dark"
          options={{
            readOnly,
            minimap:               { enabled: true, scale: 1 },
            fontSize:              13,
            fontFamily:            "'Geist Mono', 'Fira Code', 'Courier New', monospace",
            fontLigatures:         true,
            lineNumbers:           'on',
            roundedSelection:      true,
            scrollBeyondLastLine:  false,
            automaticLayout:       true,
            tabSize:               4,
            wordWrap:              'on',
            renderLineHighlight:   'gutter',
            cursorBlinking:        'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling:       true,
            padding:               { top: 12, bottom: 12 },
            overviewRulerBorder:   false,
            hideCursorInOverviewRuler: true,
            scrollbar: {
              verticalScrollbarSize:   6,
              horizontalScrollbarSize: 6,
            },
          }}
          onMount={((editor) => { editorRef.current = editor; }) as OnMount}
        />
      </div>
    </div>
  );
}
