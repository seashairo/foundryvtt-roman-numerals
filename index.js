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

function deromanize (input) {
    const roman = input.toUpperCase()
    const romanPattern = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/
    const token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g

    if (!romanPattern.test(roman)) {
        return false
    }

    let decimal = 0
    let m
    while (m = token.exec(roman)) {
        decimal += roman_map[m[0]]
    }

    return decimal;
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
        if(i !== 6) {
            // return
        }

        const input = inputs[i]
        const inputElement = $(input)

        if(inputElement.attr('placeholder')) {
            inputElement.attr('placeholder', inputElement.attr('placeholder').replaceAll(/[0-9]+/g, (input) => {
                return romanize(input)
            }))
        }

        const ttype = inputElement.attr('type')
        if(ttype === 'checkbox') {
            return
        }

        const clonedElement = inputElement.clone()
        clonedElement.removeAttr('name')
        clonedElement.removeAttr('data-dtype')
        clonedElement.attr('type', 'text')
        clonedElement.val(romanize(inputElement.val()))

        inputElement.hide()

        clonedElement.focus(ev => {
            inputElement.show()
            clonedElement.hide()
            inputElement.focus()
        })

        inputElement.blur(() => {
            inputElement.hide()
            clonedElement.show()
            clonedElement.val(romanize(inputElement.val()))
        })

        inputElement.after(clonedElement)
    })
})
