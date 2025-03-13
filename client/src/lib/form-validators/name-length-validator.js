import { createCharacterLengthRange } from '@dhis2/ui'

const twoToHundredValidator = createCharacterLengthRange(2, 100)

export const nameLengthValidator = (value) => twoToHundredValidator(value)
