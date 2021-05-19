const AppDescription = ({ description, paragraphClassName }) => {
    const lines = description.split('\n')
    return lines.map((line, index) => {
        if (!line.trim()) {
            return <br key={index} />
        }
        return (
            <p key={index} className={paragraphClassName}>
                {line}
            </p>
        )
    })
}

export default AppDescription
