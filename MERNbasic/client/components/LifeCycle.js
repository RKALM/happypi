import React, { useEffect, useRef, useState } from 'react'

const LifeCycle = () => {
    // Reference available on the first render
    const renderRef = useRef(0)
    
    // Initial state available on first render
    const [number, setNumber] = useState(0)

    // Initial state value based on a computation available on first render
    const [string, setString] = useState(() => {
        for (let i = 0; i < 10000000; i++) {
            continue
        }

        return 'string'
    })

    // Runs before every render
    console.log(number, string)

    // Runs after every render
    useEffect(() => {
        console.log('useEffect without dependency array')
    })

    // Runs on first rendering only
    useEffect(() => {
        console.log('useEffect with an empty dependency array')
    }, [])

    // Runs on first render AND when the number state has changed
    useEffect(() => {
        console.log('useEffect with a dependancy on the number state')

        if (number % 3 === 0) {
            const randomCharacter = String.fromCharCode(Math.round(Math.random() * 200))

            // Will trigger a re-rendering
            setString(randomCharacter)
        }
    }, [number])

    // Runs on the first render AND when the string state has changed
    useEffect(() => {
        console.log('useEffect with a dependancy on the string state')
    }, [string])

    // Updating the current reference value does NOT trigger re-rendering
    renderRef.current++
    console.log('Times rendered: ' + renderRef.current)
    return (
        <div>
            <p>{string}</p>
            <p>{number}</p>
            {/*  onClick will trigger a re-rendering */}
            <button onClick={() => setNumber(number + 1)}>increment</button>
        </div>
    )

}

export default LifeCycle
