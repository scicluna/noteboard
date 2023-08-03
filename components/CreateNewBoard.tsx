'use client'
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { newBoard } from "@/utils/newBoard";
import { BoardSelectorProps } from "./BoardSelector";
import { useRouter } from "next/navigation";

export default function CreateNewBoard({ user }: BoardSelectorProps) {
    const router = useRouter()
    const [modal, setModal] = useState(false)
    const [name, setName] = useState("")

    async function buildNewBoard(e: any) {
        await newBoard(e, user, name)
        router.refresh()
        setModal(prev => !prev)
        setName("")
    }

    return (
        <>
            <button className="fixed" onClick={() => setModal(prev => !prev)}>
                <FontAwesomeIcon icon={faPlus} width={30} height={30} color="gray" className="hover:text-black" />
            </button>
            {modal &&
                <form className="fixed flex shadow-gray-300 shadow-md items-center p-2 bg-white left-20 gap-4 outline outline-1 outline-gray-200"
                    onSubmit={buildNewBoard}>
                    <label htmlFor="boardname">Board Name:</label>
                    <input value={name} onChange={e => setName(e.target.value)} type="text" name="boardname" className="outline outline-gray-200 outline-1 bg-gray-50 p-2" />
                    <button type="submit" className="text-blue-400 hover:text-blue-300">Create</button>
                    <button type="button" className="text-blue-400 hover:text-blue-300" onClick={() => setModal(prev => !prev)}>X</button>
                </form>}
        </>
    )
}