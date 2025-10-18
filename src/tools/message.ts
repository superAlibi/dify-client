export function parseMessage(message: string) {
  return message.replace(/\\u([0-9a-f]{4})/g, (_match, p1) => {
    return String.fromCharCode(Number.parseInt(p1, 16))
  })
}


export function messageToBranchTree(): any[] {
  return []
}