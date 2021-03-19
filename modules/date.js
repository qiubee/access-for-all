function currentDateTime() {
    const date = new Date(new Date().setDate(new Date().getDate()));
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const month = "0" + (date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

exports.currentDateTime = currentDateTime;