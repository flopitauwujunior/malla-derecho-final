let ramosGuardados = JSON.parse(localStorage.getItem("ramosGuardados")) || {};

const semestres = [
  { nombre: "01 SEMESTRE", ramos: [
    "Historia del Pensamiento Político y Teoría del Estado",
    "Fuentes, Proceso y Bienes en el Derecho Romano",
    "Historia del Derecho Antiguo y Medieval",
    "Fundamentos de Filosofía Práctica",
    "Introducción al Estudio del Derecho Positivo Chileno",
    "Taller de Memoria 1",
    "Inglés 1",
    "Antropología Cristiana"
  ]},
  { nombre: "02 SEMESTRE", ramos: [
    "Teoría de la Constitución e Historia Política y Constitucional de Chile",
    "Familia y Patrimonio en el Derecho Romano",
    "Historia del Derecho Moderno y Contemporáneo",
    "Teoría de la Normatividad",
    "Judicatura",
    "Inglés 2",
    "Ética Cristiana"
  ]},
  { nombre: "03 SEMESTRE", ramos: [
    "Derecho Constitucional Orgánico",
    "Derecho Internacional Público",
    "Negocio Jurídico",
    "Tutela Judicial Efectiva y Debido Proceso",
    "Estrategias de Producción del Discurso Oral",
    "Taller de Memoria 2",
    "Inglés 3"
  ]},
  { nombre: "04 SEMESTRE", ramos: [
    "Derechos Fundamentales",
    "Bienes",
    "Disposiciones Comunes a Todo Procedimiento",
    "Teoría del Delito",
    "Formación Fundamental 3",
    "Inglés 4"
  ]},
  { nombre: "05 SEMESTRE", ramos: [
    "Bases del Derecho Administrativo",
    "Derecho Individual del Trabajo",
    "Derecho y Orden Económico",
    "Obligaciones y Contratos",
    "Juicio Declarativo y Prueba",
    "Responsabilidad Penal",
    "Taller de Memoria 3",
    "Formación Fundamental 4",
    "Optativo 1"
  ]},
  { nombre: "06 SEMESTRE", ramos: [
    "Actuación de la Administración del Estado",
    "Derecho Colectivo del Trabajo",
    "Regulación Económica y Derecho de la Libre Competencia",
    "Responsabilidad Civil",
    "Recursos Procesales",
    "Delito Contra Intereses Individuales",
    "Enseñanza Clínica del Derecho: Negociación y Formas Autocompositivas",
    "Optativo 2"
  ]},
  { nombre: "07 SEMESTRE", ramos: [
    "Control y Responsabilidad de la Administración del Estado",
    "Introducción al Derecho Comercial y Organización Jurídica de la Empresa",
    "Derecho de los Mercados Financieros",
    "Contratos en Particular",
    "Ejecución y Tutela Cautelar",
    "Taller de Memoria 4",
    "Optativo 3"
  ]},
  { nombre: "08 SEMESTRE", ramos: [
    "Derecho Tributario",
    "Sociedades de Capital",
    "Teoría del Ordenamiento Jurídico",
    "Familia",
    "Derecho Procesal Penal",
    "Enseñanza Clínica: Litigación Oral",
    "Formación Fundamental 5"
  ]},
  { nombre: "09 SEMESTRE", ramos: [
    "Enseñanza Clínica: Pasantía Profesional",
    "Derecho Concursal y de Seguros",
    "Filosofía del Derecho y Teorías de la Justicia",
    "Sucesiones",
    "Ética Profesional",
    "Memoria"
  ]},
  { nombre: "10 SEMESTRE", ramos: [
    "Licenciatura"
  ]}
];

function guardarRamos() {
  const data = {};
  document.querySelectorAll(".semestre").forEach(sem => {
    const id = sem.id;
    const ramos = [];
    sem.querySelectorAll(".ramo").forEach(ramo => {
      ramos.push({
        texto: ramo.textContent,
        aprobado: ramo.classList.contains("aprobado")
      });
    });
    data[id] = ramos;
  });
  localStorage.setItem("ramosGuardados", JSON.stringify(data));
}

function crearRamo(ramoInfo) {
  const ramoDiv = document.createElement("div");
  ramoDiv.classList.add("ramo");
  ramoDiv.textContent = ramoInfo.texto;
  if (ramoInfo.aprobado) ramoDiv.classList.add("aprobado");
  ramoDiv.draggable = true;

  ramoDiv.addEventListener("click", () => {
    ramoDiv.classList.toggle("aprobado");
    guardarRamos();
  });

  ramoDiv.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("ramo", JSON.stringify({
      texto: ramoDiv.textContent,
      aprobado: ramoDiv.classList.contains("aprobado"),
      origenId: ramoDiv.parentElement.id
    }));
    ramoDiv.classList.add("moviendo");
  });

  return ramoDiv;
}

function crearMalla() {
  const container = document.getElementById("malla-container");
  container.innerHTML = "";

  semestres.forEach((sem, idx) => {
    const div = document.createElement("div");
    div.classList.add("semestre");
    const id = `sem-${idx}`;
    div.setAttribute("id", id);
    div.innerHTML = `<h2>${sem.nombre}</h2>`;

    const ramos = ramosGuardados[id] || sem.ramos.map(t => ({ texto: t, aprobado: false }));

    ramos.forEach(ramoInfo => {
      const ramoDiv = crearRamo(ramoInfo);
      div.appendChild(ramoDiv);
    });

    div.addEventListener("dragover", (e) => e.preventDefault());

    div.addEventListener("drop", (e) => {
      e.preventDefault();
      const data = JSON.parse(e.dataTransfer.getData("ramo"));
      const origen = document.getElementById(data.origenId);
      const moviendo = origen.querySelector(".moviendo");

      if (moviendo) {
        moviendo.classList.remove("moviendo");
        e.currentTarget.appendChild(moviendo);
        guardarRamos();
      }
    });

    container.appendChild(div);
  });
}

crearMalla();
