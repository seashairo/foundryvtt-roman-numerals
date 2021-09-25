const roman_map = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1
}

const romanCharacters = Object.keys(roman_map)
const decimalValues = Object.values(roman_map)

function romanize(decimal) {
    if(decimal === 0 || decimal === '0') {
        return 'N'
    }

    let output = ''

    for (let i = 0; i < romanCharacters.length; i++) {
        while (decimal >= decimalValues[i]) {
            decimal -= decimalValues[i]
            output += romanCharacters[i]
        }
    }

    return output
}

Hooks.on('renderChatMessage', (message, html, data) => {
    const classesToReplace = [
        'span', 'div', 'time', 'h4', 'li', '.dice-formula', '.part-formula', '.part-total'
    ]

    classesToReplace.forEach(cls => {
        const els = html.find(cls)

        if(els.children().length !== 0) {
            return
        }

        els.each(i => {
            const el = $(els[i])
            el.text(el.text().replaceAll(/[0-9]+/g, (input) => {
                return romanize(input)
            }))
        })
    })
})

Hooks.on('renderActorSheet', (message, html, data) => {
    const classesToReplace = [
        'span',
        'div',
        '.levels'
    ]

    classesToReplace.forEach(cls => {
        const els = html.find(cls)

        if(els.children().length !== 0) {
            return
        }

        els.each(i => {
            const el = $(els[i])
            el.text(el.text().replaceAll(/[0-9]+/g, (input) => {
                return romanize(input)
            }))
        })
    })

    const inputs = html.find('input')
    inputs.each(i => {
        const input = $(inputs[i])

        const placeholder = input.attr('placeholder')
        if(placeholder) {
            input.attr('placeholder', placeholder.replaceAll(/[0-9]+/g, (input) => {
                return romanize(input)
            }))
        }

        input.focus(el => {

        })

        input.blur(el => {
            console.log(el)
        })
    })
})
