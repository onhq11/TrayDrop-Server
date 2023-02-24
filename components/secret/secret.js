import generator from 'generate-password'

export const generateSecret = () => {
    return generator.generate({
        length: 64,
        numbers: true,
        symbols: false,
    })
}