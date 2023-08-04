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

const make_jurusan = (item) => {
    const option = document.createElement('option')
    option.value = item.Jurusan
    option.innerText = item.Jurusan
    return option
}

const make_matakuliah = (item) => {
    const {ID, Nama, SKS, Jurusan, SemesterMinimal, PrediksiNilai} = item;

    const idText = document.createElement('h3')
    idText.innerText = ID + ' - ' + Nama
    const sksText = document.createElement('p')
    sksText.innerHTML = 'SKS &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;: ' + SKS
    const jurusanText = document.createElement('p')
    jurusanText.innerHTML = 'Jurusan &emsp;&emsp;&emsp;&emsp;&emsp; : ' + Jurusan
    const semesterText = document.createElement('p')
    semesterText.innerHTML = 'Semester Minimal&emsp;: ' + SemesterMinimal
    const prediksiText = document.createElement('p')
    prediksiText.innerHTML = 'Prediksi Nilai&emsp;&emsp;&emsp;&nbsp;: ' + PrediksiNilai

    const card = document.createElement('article')
    card.classList.add('course-item')
    card.append(idText, sksText, jurusanText, semesterText, prediksiText)
    return card
}

const reset_datas = async() => {
    try {
        const response = await fetch('http://localhost:36656/', {
            method: 'DELETE',
        });
        jurusan = []
        matakuliah = []

        matkul_list.innerHTML = ''
        constraint_jurusan.innerHTML = ''
    } catch (err) {
        alert(err)
    }
}

reset_button.addEventListener('click', async() => {
    await reset_datas()
})

const get_jurusan = async() => {
    try {
        const response = await fetch('http://localhost:36656/jurusan', {
            method: 'GET',
        });
        const data = await response.json();
        old_data = jurusan
        jurusan = data

        let diff = jurusan.filter(x => !old_data.includes(x));
        diff.forEach(element => {
            constraint_jurusan.append(make_jurusan(element))
        })
    } catch (err) {
        alert(err)
    }
}

const get_matakuliah = async() => {
    try {
        const response = await fetch('http://localhost:36656/matakuliah', {
            method: 'GET',
        });
        const data = await response.json();
        old_data = matakuliah
        matakuliah = data

        let diff = matakuliah.filter(x => !old_data.includes(x));
        diff.forEach(element => {
            matkul_list.append(make_matakuliah(element))
        })
    } catch (err) {
        alert(err)
    }
}

const post_jurusan = async() => {
    try {
        const file = upload_file.files[0]
        let jsonData = await file.text()

        const response = await fetch('http://localhost:36656/jurusan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
    } catch (err) {
        if (err == 'TypeError: Failed to fetch'){
            alert('SQL is Processing, Please Wait')
        } else {
            alert(err)
        }
    }
}

const post_matakuliah = async() => {
    try {
        const file = upload_file.files[0]
        let jsonData = await file.text()

        const response = await fetch('http://localhost:36656/matakuliah', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
    } catch (err) {
        if (err == 'TypeError: Failed to fetch'){
            alert('SQL is Processing, Please Wait')
        } else {
            alert(err)
        }
    }
}

const post_file = async() => {
    if (upload_type.checked){
        await post_matakuliah()
        await get_matakuliah()
    } else {
        await post_jurusan()
        await get_jurusan()
    }
}

const search_matakuliah = async() => {
    jurusan = constraint_jurusan.value
    sksmin = constraint_sksmin.value
    sksmax = constraint_sksmax.value
    semester = constraint_semester.value

    if (sksmin == ''){
        alert('SKS Minimal can\'t be Empty')
        return
    }
    if (sksmax == ''){
        alert('SKS Maximal can\'t be Empty')
        return
    }
    if (semester == ''){
        alert('Semester can\'t be Empty')
        return
    }
    if (sksmin < 0){
        alert('SKS Minimal can\'t be Negative')
        return
    }
    if (sksmax < 0){
        alert('SKS Maximal can\'t be Negative')
        return
    }
    if (semester < 0){
        alert('Semester can\'t be Negative')
        return
    }

    try {
        const response = await fetch('http://localhost:36656/find', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "Jurusan": jurusan,
                "Semester": parseInt(semester),
                "SKS_Min": parseInt(sksmin),
                "SKS_Max": parseInt(sksmax)
            })
        });
        const data = await response.json();

        res = ""
        totalSKS = data.SKS
        GPA = data.GPA.toFixed(2)
        matkul = data.MataKuliah
        if (matkul.length == 0){
            alert('No Eligible Mata Kuliah Combination Found')
            return
        }
        for (i = 0; i < matkul.length; i++){
            res += i+1 + '. ' + matkul[i].ID + " - " + matkul[i].Nama  + '\n'
        }
        res += '\nTotal SKS : ' + totalSKS + '\n'
        res += 'IP : ' + GPA + '\n'
        alert(res)
    } catch (err) {
        alert(err)
    }
}

search_button.addEventListener('click', async() => {
    await search_matakuliah()
})

upload_button.addEventListener('click', async() => {
    await post_file()
})

document.addEventListener('DOMContentLoaded', async() => {
    await get_jurusan()
    await get_matakuliah()
})
