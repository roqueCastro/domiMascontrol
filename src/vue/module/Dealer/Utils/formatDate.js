export const formatTimezoneDate = function (dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    })
};

export const calculateDurationTimezone = function(start, end) {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffMs = endDate - startDate
    const diffMins = Math.round(diffMs / 60000)
    const hours = Math.floor(diffMins / 60)
    const minutes = diffMins % 60
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes} min`
}