// list of jurusan and matakuliah
let jurusan = []
let matakuliah = []

// getting each element from html
const matkul_list = document.getElementById('list-body')
const upload_button = document.getElementById('upload-button')
const upload_type = document.getElementById('upload-type')
const upload_file = document.getElementById('json-file')
const reset_button = document.getElementById('reset-button')
const constraint_jurusan = document.getElementById('jurusan')
const constraint_sksmin = document.getElementById('sks-min')
const constraint_sksmax = document.getElementById('sks-max')
const constraint_semester = document.getElementById('semester')
const search_button = document.getElementById('search')

const reset_datas = async() => {
    try {
        const response = await fetch('http://localhost:8080/', {
            method: 'DELETE',
        });
        jurusan = []
        matakuliah = []
    } catch (err) {
        alert(err)
    }
}
