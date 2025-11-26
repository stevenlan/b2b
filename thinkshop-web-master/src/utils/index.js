function formatDateTime(timestamp) {
  const date = new Date(Number(timestamp));

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function formatPrice(price) {
  if (typeof price !== 'number') {
    var numberPrice = Number(price);
    if (isNaN(numberPrice)) {
      return price;
    } else {
      price = numberPrice;
    }
  }
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export {
  formatDateTime,
  formatPrice
}
