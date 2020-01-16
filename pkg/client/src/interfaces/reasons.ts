export enum Reasons {
  RESERVED_DO_NOT_USE = 0,
  ABSENT = 1,
  ILLNESS = 2,
  IMPORTANT = 3,
}

export function getReasonName(reason: Reasons) {
  switch (reason) {
    case Reasons.ABSENT:
      return 'НБ'
    case Reasons.ILLNESS:
      return 'ХВ'
    case Reasons.IMPORTANT:
      return 'ПП'
    case Reasons.RESERVED_DO_NOT_USE:
    default:
      return ''
  }
}
