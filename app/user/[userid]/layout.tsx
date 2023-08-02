import NavBar from "@/components/Navbar"

export default function UserLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    
    return (
        <section className="w-full h-full">
            <NavBar />
            {children}
        </section>
    )
}