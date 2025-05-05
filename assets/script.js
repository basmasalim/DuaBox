// ? =============> Global ===============>
let duaInput = document.getElementById("duaInput"),
  saveBtn = document.getElementById("saveBtn"),
  editBtn = document.getElementById("editBtn"),
  loading = document.getElementById("loading"),
  allDuas = [],
  duaToBeEdit;

// ? Initialize
displayData();

// * =============> Events ===============>
saveBtn.addEventListener("click", postData);
editBtn.addEventListener("click", editData);
// ! =============> Functions ===============>

// ? Post
async function postData() {
  if (duaInput.value.trim() === "") {
    Swal.fire("من فضلك، اكتب دعاء قبل الحفظ ❤️");
    return;
  }
  await getData();
  const newId =
    allDuas.length > 0
      ? Math.max(...allDuas.map((d) => parseInt(d.id))) + 1
      : 1;
  loading.classList.remove("d-none");
  await fetch(`https://basmasalim.github.io/DuaBox/assets/db.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: newId.toString(),
      dua: duaInput.value,
    }),
  });

  clearForm();
  displayData();
  loading.classList.add("d-none");
}

// ? Get
async function getData() {
  let response = await fetch(`https://basmasalim.github.io/DuaBox/assets/db.json`);
  let data = await response.json();
  allDuas = data;
}

// ? Display
async function displayData() {
  await getData();
  let cartona = "";
  for (let i = 0; i < allDuas.length; i++) {
    cartona += `
      <div class="box rounded-3 px-3 py-2">
        <div class="body">
          <p class="fs-5">${allDuas[i].dua}</p>
        </div>
        <footer class="d-flex justify-content-end align-items-center gap-2">
          <button class="btn btn-success edit" onclick="preEditData(${i}, ${allDuas[i].id})">Edit</button>
          <button class="btn btn-danger" onclick="deleteData(${allDuas[i].id})">Delete</button>
        </footer>
    </div>
  `;
  }
  document.getElementById("dualist").innerHTML = cartona;
}

// ? Clear
function clearForm() {
  duaInput.value = "";
}

// ? Delete
async function deleteData(id) {
  loading.classList.remove("d-none");

  await fetch(`https://basmasalim.github.io/DuaBox/assets/db.json/${id}`, {
    method: "DELETE",
  });
  displayData();
  loading.classList.add("d-none");
}

// ? Pre EditData
function preEditData(index, id) {
  duaInput.value = allDuas[index].dua;
  duaToBeEdit = id;
  editBtn.classList.replace("d-none", "d-block");
  saveBtn.classList.replace("d-block", "d-none");
}

// ? Edit
async function editData() {
  loading.classList.remove("d-none");

  await fetch(`https://basmasalim.github.io/DuaBox/assets/db.json/${duaToBeEdit}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dua: duaInput.value,
    }),
  });
  displayData();
  editBtn.classList.replace("d-block", "d-none");
  saveBtn.classList.replace("d-none", "d-block");
  clearForm();
  loading.classList.add("d-none");
}
