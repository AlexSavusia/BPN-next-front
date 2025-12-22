"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { customModules } from "@/bpmn/customModeler";
import "@/bpmn/styles.css";

const DEFAULT_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  id="Definitions_1"
  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Start" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_1" bpmnElement="StartEvent_1">
        <dc:Bounds x="200" y="140" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

export function BpmnEditor() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const modelerRef = useRef<any>(null);

    const [error, setError] = useState<string | null>(null);
    const [xml, setXml] = useState<string>("");

    const storageKey = useMemo(() => "bpmn-demo-xml", []);

    useEffect(() => {
        let disposed = false;

        async function init() {
            try {
                setError(null);

                // bpmn-js должен грузиться только на клиенте
                const BpmnJSModule = await import("bpmn-js/lib/Modeler");
                const BpmnModeler = (BpmnJSModule as any).default;

                if (!containerRef.current) return;

                // очистка контейнера (на случай StrictMode/повторного маунта)
                containerRef.current.innerHTML = "";

                const modeler = new BpmnModeler({
                    container: containerRef.current,
                    additionalModules: customModules,
                });

                modelerRef.current = modeler;

                // грузим из localStorage (мок) или дефолтный XML
                const saved = localStorage.getItem(storageKey);
                const initialXml = saved || DEFAULT_XML;

                await modeler.importXML(initialXml);

                // fit viewport
                const canvas = modeler.get("canvas");
                canvas.zoom("fit-viewport");

                if (!disposed) {
                    setXml(initialXml);
                }
            } catch (e: any) {
                console.error(e);
                setError(e?.message || "Не удалось инициализировать BPMN редактор");
            }
        }

        init();

        return () => {
            disposed = true;
            try {
                if (modelerRef.current) {
                    modelerRef.current.destroy();
                    modelerRef.current = null;
                }
            } finally {
                if (containerRef.current) containerRef.current.innerHTML = "";
            }
        };
    }, [storageKey]);

    async function handleSave() {
        try {
            setError(null);
            const modeler = modelerRef.current;
            if (!modeler) return;

            const { xml } = await modeler.saveXML({ format: true });
            localStorage.setItem(storageKey, xml);
            setXml(xml);
        } catch (e: any) {
            console.error(e);
            setError(e?.message || "Ошибка сохранения XML");
        }
    }

    async function handleReset() {
        try {
            setError(null);
            const modeler = modelerRef.current;
            if (!modeler) return;

            localStorage.removeItem(storageKey);
            await modeler.importXML(DEFAULT_XML);
            const canvas = modeler.get("canvas");
            canvas.zoom("fit-viewport");
            setXml(DEFAULT_XML);
        } catch (e: any) {
            console.error(e);
            setError(e?.message || "Ошибка сброса диаграммы");
        }
    }

    function handleDownload() {
        // простая выгрузка XML (мок)
        const blob = new Blob([xml || ""], { type: "application/xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "diagram.bpmn";
        a.click();
        URL.revokeObjectURL(url);
    }



    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
                <button
                    onClick={handleSave}
                    className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
                >
                    Save (localStorage)
                </button>

                <button
                    onClick={handleReset}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-100"
                >
                    Reset
                </button>

                <button
                    onClick={handleDownload}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-100"
                >
                    Download .bpmn
                </button>

                <div className="ml-auto text-xs text-slate-500">
                    Палитра слева → таски/ивенты/гейтвеи/стрелки
                </div>
            </div>

            {error && (
                <div className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {error}
                </div>
            )}

            {/* контейнер редактора */}
            <div
                ref={containerRef}
                className="h-[70vh] w-full rounded-lg border border-slate-200"
            />
        </section>
    );
}
