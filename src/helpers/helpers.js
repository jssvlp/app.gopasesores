
export function setValues(state,e,type) {
    let values = state;
    console.log('e', values,e.target.name)
    switch (type) {
        case 'text':
            return values[e.target.name] = e.target.value
        case 'date':
            console.log('e', e)
            return e



        default:
            break;
    }

}


