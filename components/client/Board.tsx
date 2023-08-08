'use client'
import { BoardUser, Note } from "../server/BoardSelector"
import { useRef, useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import { newNote } from "@/utils/newNote";
import NoteCard from "./Note";
import { updateNotePosition } from "@/utils/updateNotePosition";
import { updateNoteSize } from "@/utils/updateNoteSize";

type BoardProps = {
    notes: Note[]
    user: BoardUser
    ownerid: string
    name: string
    boardid: string
    maxZ: number
}

export default function Board({ notes, user, ownerid, name, boardid, maxZ }: BoardProps) {
    const [maxZIndex, setMaxZIndex] = useState<number>(maxZ);
    const [dragging, setDragging] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1)
    const isOwner = user.id == ownerid
    const [visible, setVisible] = useState(false);
    const [allNotes, setAllNotes] = useState<Note[] | null>(notes)
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo((3000 - window.innerWidth) / 2, (3000 - window.innerHeight) / 2)
        document.body.style.overflow = 'hidden';
        setVisible(true)
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [])

    useEffect(() => {
        const debouncedUpdate = debounce((width: number, height: number, tempId: string) => {
            const updatedNote = allNotes?.find(note => note.tempid === tempId);

            if (updatedNote && (updatedNote.width != `${width}px` || updatedNote.height != `${height}px`)) {
                updatedNote.width = `${width}px`;
                updatedNote.height = `${height}px`;
                setAllNotes([...(allNotes || [])]);
                updateNoteSize(updatedNote, isOwner)
            }
        }, 250);

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const rect = entry.target.getBoundingClientRect();
                const width = rect.width / zoom;
                const height = rect.height / zoom;
                const tempId = entry.target.getAttribute("data-tempid");
                debouncedUpdate(width, height, tempId!);
            }
        });

        allNotes?.forEach(note => {
            const element = document.querySelector(`#note-${note.tempid}`);
            if (element) {
                resizeObserver.observe(element);
            }
        });

        return () => {
            allNotes?.forEach(note => {
                const element = document.querySelector(`#note-${note.tempid}`);
                if (element) {
                    resizeObserver.unobserve(element);
                }
            });
        };
    }, [allNotes]);

    function debounce<T extends any[]>(fn: (...args: T) => void, ms: number): (...args: T) => void {
        let timer: ReturnType<typeof setTimeout> | null;
        return (...args: T): void => {
            clearTimeout(timer as ReturnType<typeof setTimeout>);
            timer = setTimeout(() => {
                timer = null;
                fn(...args);
            }, ms);
        };
    }

    function createNote() {
        if (!isOwner) return
        const left = window.scrollX + window.innerWidth / 2;
        const top = window.scrollY + window.innerHeight / 2;

        const newZIndex = maxZIndex + 1;
        setMaxZIndex(newZIndex);

        const note = {
            tempid: uuidv4(),
            boardid: boardid,
            text: "New note",
            width: "200px",
            height: "100px",
            left: `${left}px`,
            top: `${top}px`,
            fontSize: `20px`,
            zIndex: newZIndex
        }
        setMaxZIndex(note.zIndex);
        if (allNotes) {
            setAllNotes(prevNotes => [...prevNotes!, note]);
        } else {
            setAllNotes([note])
        }
        newNote(note);
    }

    function handleDragUpdate(note: Note, deltaX: number, deltaY: number) {
        const originalLeft = parseInt(note.left.slice(0, -2));
        const originalTop = parseInt(note.top.slice(0, -2));

        const newLeft = originalLeft + deltaX;
        const newTop = originalTop + deltaY;
        const newZIndex = maxZIndex + 1;
        setMaxZIndex(newZIndex);
        setAllNotes(allNotes!.map((n) => {
            if (n.tempid === note.tempid) {
                return { ...n, left: `${newLeft}px`, top: `${newTop}px`, zIndex: maxZIndex };
            } else {
                return n;
            }
        }));
        const updatedNote = { ...note, left: `${newLeft}px`, top: `${newTop}px`, zIndex: maxZIndex };
        updateNotePosition(updatedNote, isOwner);
    }


    function handleWheel(event: React.WheelEvent) {
        const MAX_ZOOM = 4
        const MIN_ZOOM = .5

        if (zoom >= 4) {
            event.preventDefault();
            event.stopPropagation();
        }
        let newZoom = zoom - event.deltaY * 0.001;
        newZoom = Math.min(Math.max(MIN_ZOOM, newZoom), MAX_ZOOM)
        setZoom(newZoom);
    }

    function handleMouseDown(e: React.MouseEvent) {
        if ((e.target as HTMLElement).classList.contains('note')) return;
        window.getSelection()?.removeAllRanges();
        (document.activeElement as HTMLElement).blur()
        setDragging(true);
        setMousePos({ x: e.clientX, y: e.clientY });
    }

    function handleMouseMove(e: React.MouseEvent) {
        if (dragging) {
            const dx = e.clientX - mousePos.x;
            const dy = e.clientY - mousePos.y;
            window.scrollTo(window.scrollX - dx, window.scrollY - dy);
            setMousePos({ x: e.clientX, y: e.clientY });
        }
    }

    function handleMouseUp() {
        setDragging(false);
    }

    return (
        <>
            <div className="fixed top-[12dvh] w-1/4 h-20 left-1/2 -translate-x-1/2 bg-gray-400 z-30 opacity-80 flex justify-center items-center">
                <button onClick={createNote}>New Note</button>
            </div>
            <section ref={containerRef} className="absolute pt-[10dvh] w-[3500px] h-[3250px] bg-black flex items-center justify-center" style={{ visibility: visible ? 'visible' : 'hidden', fontFamily: 'fantasy' }} >
                <section className="absolute w-[3250px] h-[3000px] bg-gray-100 overflow-hidden" style={{ transform: `scale(${zoom})` }} onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                    {allNotes && allNotes.map(note => (
                        <NoteCard
                            key={note.tempid}
                            note={note}
                            isOwner={isOwner}
                            onDragUpdate={handleDragUpdate}
                        />
                    ))}
                </section>
            </section>
        </>
    )
}