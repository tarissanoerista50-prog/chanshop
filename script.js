document.getElementById('submit-testimoni').addEventListener('click', function() {
    let input = document.getElementById('testimoni-input').value;
    if (input.trim() !== '') {
        let newTestimoni = document.createElement('blockquote');
        newTestimoni.innerHTML = `<img src="assets/icons/quote.svg" alt=""><p>${input}</p><cite>- Pelanggan Baru</cite>`;
        document.getElementById('testimoni-list').appendChild(newTestimoni);
        document.getElementById('testimoni-input').value = '';
    }
});
