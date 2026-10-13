export function goBack(navigate: (to: string) => void) {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    navigate('/')
  }
}

export function reloadPage(location: Pick<Location, 'reload'> = window.location) {
  location.reload()
}

export function leaveTo(
  href: string,
  location: Pick<Location, 'assign'> = window.location,
) {
  location.assign(href)
}
