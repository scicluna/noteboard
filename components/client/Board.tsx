'use client'
import { BoardUser, Note } from "../server/BoardSelector"
import { useRef, useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import { newNote } from "@/utils/newNote";
import NoteCard from "./NoteCard";
import { updateNotePosition } from "@/utils/updateNotePosition";
import { updateNoteSize } from "@/utils/updateNoteSize";
import { updateNoteConnection } from "@/utils/updateNoteConnection";
import { Connection } from "@/utils/getConnections";



type BoardProps = {
    notes: Note[]
    user: BoardUser
    ownerid: string
    name: string
    boardid: string
    maxZ: number
    connections: Connection[]
}

export default function Board({ notes, user, ownerid, name, boardid, maxZ, connections }: BoardProps) {
    const [allConnections, setAllConnections] = useState<Connection[]>(connections);
    const [maxZIndex, setMaxZIndex] = useState<number>(maxZ || 0);
    const [dragging, setDragging] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1)
    const isOwner = user.id == ownerid
    const [visible, setVisible] = useState(false);
    const [allNotes, setAllNotes] = useState<Note[] | null>(notes)
    const [pinnedNotes, setPinnedNotes] = useState<Note[]>([])
    const containerRef = useRef<HTMLDivElement>(null);
    const drawnConnections = new Set()
    drawnConnections.clear()

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
            if (width === 0 || height === 0) return;
            const updatedNote = allNotes?.find(note => note.tempid === tempId);

            if (updatedNote && (updatedNote.width != `${width}px` || updatedNote.height != `${height}px`)) {
                updatedNote.width = `${width}px`;
                updatedNote.height = `${height}px`;
                setAllNotes([...(allNotes || [])]);
                updateNoteSize(updatedNote, isOwner)
            }
        }, 150);

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
            zIndex: newZIndex,
            connectNotes: []
        }
        setMaxZIndex(note.zIndex);
        if (allNotes) {
            setAllNotes(prevNotes => [...prevNotes!, note]);
        } else {
            setAllNotes([note])
        }
        newNote(note);
    }

    async function handleDragUpdate(note: Note, deltaX: number, deltaY: number) {
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
        await updateNotePosition(updatedNote, isOwner);
        redrawConnections(updatedNote);
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

    function removeNote(noteToDelete: Note) {
        setAllNotes(prev => prev!.filter(note => note.tempid !== noteToDelete.tempid))
    }

    function connectNotes(note: Note) {
        setPinnedNotes(prevNotes => {
            if (prevNotes.length < 2) {
                return [...prevNotes, note];
            }
            return prevNotes;
        });
    }

    useEffect(() => {
        if (pinnedNotes.length === 2) {
            const [noteOne, noteTwo] = pinnedNotes
            postNewConnection(noteOne, noteTwo)
            drawNewConnection(noteOne, noteTwo)
            setPinnedNotes([]);
        }
    }, [pinnedNotes]);

    async function postNewConnection(noteOne: Note, noteTwo: Note) {
        await updateNoteConnection(noteOne, noteTwo, isOwner)
    }

    function generateConnectionPath(note: Note, connectedNote: Note): JSX.Element | null {
        const connectionKey = [note.tempid, connectedNote.tempid].sort().join('-');

        if (!drawnConnections.has(connectionKey) && note.tempid !== connectedNote.tempid) {
            drawnConnections.add(connectionKey)
            const startX = parseInt(note.left) + parseInt(note.width) / 2;
            const startY = parseInt(note.top) + parseInt(note.height);

            const endX = parseInt(connectedNote.left) + parseInt(connectedNote.width) / 2;
            const endY = parseInt(connectedNote.top) + parseInt(connectedNote.height);

            const deltaY = Math.abs(endY - startY);
            const deltaX = Math.abs(endX - startX);
            const offset = Math.max(deltaY, 100);

            const controlPoint1X = startX + (deltaX / 3);
            const controlPoint1Y = startY + offset;

            const controlPoint2X = endX - (deltaX / 3);
            const controlPoint2Y = endY + offset;

            const pathData = `M${startX} ${startY} C${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`;

            return (
                <path
                    key={`${note.tempid}-${connectedNote.tempid}`}
                    d={pathData}
                    stroke="black"
                    strokeWidth="2"
                    fill="none"
                />
            );
        }
        return null;
    }

    function drawNewConnection(noteOne: Note, noteTwo: Note) {
        setAllConnections(prevConnections => [...prevConnections, { noteOne, noteTwo }]);
    }

    function redrawConnections(updatedNote: Note) {
        // Filter out the connections that involve the moved note
        const filteredConnections = allConnections.filter(connection =>
            connection.noteOne.tempid !== updatedNote.tempid && connection.noteTwo.tempid !== updatedNote.tempid
        );

        // Find the connections that involve the moved note
        const relatedConnections = allConnections.filter(connection =>
            connection.noteOne.tempid === updatedNote.tempid || connection.noteTwo.tempid === updatedNote.tempid
        );

        // Update the connections involving the moved note
        const updatedConnections = relatedConnections.map(connection => {
            return {
                noteOne: connection.noteOne.tempid === updatedNote.tempid ? updatedNote : connection.noteOne,
                noteTwo: connection.noteTwo.tempid === updatedNote.tempid ? updatedNote : connection.noteTwo
            };
        });
        // Combine the filtered and updated connections and set them to state
        setAllConnections([...filteredConnections, ...updatedConnections]);
    }

    return (
        <>
            <div className="fixed top-[12dvh] w-1/4 h-20 left-1/2 -translate-x-1/2 bg-gray-400 z-30 opacity-80 flex justify-center items-center">
                <button onClick={createNote}>New Note</button>
            </div>
            <section ref={containerRef} className="absolute pt-[10dvh] w-[3500px] h-[3250px] bg-black flex items-center justify-center" style={{ visibility: visible ? 'visible' : 'hidden', fontFamily: 'fantasy' }} >
                <section className={`absolute w-[3250px] h-[3000px] bg-gray-100 overflow-hidden`} style={{ transform: `scale(${zoom})` }} onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                    {allNotes && allNotes.map(note => (
                        <NoteCard
                            key={note.tempid}
                            note={note}
                            isOwner={isOwner}
                            onDragUpdate={handleDragUpdate}
                            removeNote={removeNote}
                            connectNotes={connectNotes}
                            pinning={pinnedNotes.some(pinnedNote => pinnedNote.tempid === note.tempid)}
                        />
                    ))}
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
                        <g>
                            {allConnections.map(connection => generateConnectionPath(connection.noteOne, connection.noteTwo))}
                        </g>
                    </svg>
                </section>

            </section>
        </>
    )
}