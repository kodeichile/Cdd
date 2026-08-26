const services = [
  ["ortodoncia", "Ortodoncia", "Ortodoncia", "Brackets tradicionales, esteticos e invisibles", "Desde $45.000", "service-ortodoncia.jpg"],
  ["implantes-dentales", "Implantes dentales", "Implantes", "Recupera piezas perdidas con resultados naturales", "Desde $350.000", "service-implantes-dentales.jpg"],
  ["blanqueamiento-dental", "Blanqueamiento dental", "Estetica", "Sonrisa mas blanca en una sola sesion", "Desde $60.000", "service-blanqueamiento-dental.jpg"],
  ["radiografia-panoramica", "Radiografia panoramica", "Diagnostico", "Imagen dental completa para evaluar tu tratamiento", "Consulta valor", "service-radiografia-panoramica.jpg"],
  ["odontologia-general", "Odontologia general", "Prevencion", "Chequeos, limpiezas y tratamientos preventivos", "Desde $25.000", "service-estetica-dental.jpg"],
  ["endodoncia", "Endodoncia", "Urgencias", "Tratamiento de conducto sin dolor", "Desde $80.000", "service-endodoncia.jpg"],
  ["odontopediatria", "Odontopediatria", "Ninos", "Atencion dental especializada para ninos", "Desde $30.000", "service-odontopediatria.jpg"],
  ["periodoncia", "Periodoncia", "Prevencion", "Cuidado de encias y soporte dental", "Desde $55.000", "service-periodoncia.jpg"],
  ["protesis-dental", "Protesis dental", "Rehabilitacion", "Protesis fija y removible", "Desde $120.000", "service-protesis-dental.jpg"],
  ["cirugia-oral", "Cirugia oral", "Urgencias", "Extracciones y muelas del juicio", "Desde $70.000", "service-cirugia-oral.jpg"],
  ["estetica-dental", "Estetica dental", "Estetica", "Carillas, resinas y armonizacion de sonrisa", "Desde $90.000", "service-estetica-dental.jpg"],
  ["rehabilitacion-oral", "Rehabilitacion oral integral", "Rehabilitacion", "Plan completo para recuperar funcion y estetica", "Desde $150.000", "service-rehabilitacion-oral.jpg"],
  ["urgencias-dentales", "Urgencias dentales", "Urgencias", "Atencion por dolor, fracturas o infecciones", "Desde $35.000", "service-urgencias-dentales.jpg"]
];

const testimonials = [
  ["Maria J.", "Ortodoncia", "Llegue con mucho miedo y el equipo me hizo sentir super tranquila. Mi tratamiento de ortodoncia quedo perfecto."],
  ["Carlos R.", "Implantes", "Me explicaron cada etapa con claridad. Hoy puedo comer y sonreir con confianza otra vez."],
  ["Fernanda L.", "Blanqueamiento", "El resultado fue natural y la atencion muy profesional. Me gusto que cuidaran cada detalle."],
  ["Javiera P.", "Odontopediatria", "Mi hijo salio feliz de su primera visita. El trato fue calido, claro y muy respetuoso."],
  ["Andres M.", "Endodoncia", "Tenia mucho dolor y me atendieron rapido. El procedimiento fue mucho mas comodo de lo que esperaba."]
];

function serviceCard(item) {
  const [slug, title, category, description, price, image] = item;
  return `<article class="card service-card reveal" data-category="${category}">
    <img class="service-img" src="assets/${image}" alt="${title}">
    <div class="card-body">
      <span class="tag">${category}</span>
      <h3>${title}</h3>
      <p class="muted">${description}</p>
      <p class="price">${price}</p>
      <a class="link-more" href="servicios.html#${slug}">Ver mas</a>
    </div>
  </article>`;
}

function initServices() {
  document.querySelectorAll("[data-services='featured']").forEach((node) => {
    node.innerHTML = services.filter((item) => ["ortodoncia", "implantes-dentales", "blanqueamiento-dental", "radiografia-panoramica", "odontologia-general", "endodoncia"].includes(item[0])).map(serviceCard).join("");
  });
  document.querySelectorAll("[data-services='all']").forEach((node) => {
    node.innerHTML = services.map(serviceCard).join("");
  });

  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      document.querySelectorAll(".service-card").forEach((card) => {
        card.style.display = filter === "Todos" || card.dataset.category === filter ? "" : "none";
      });
    });
  });
}

function initTestimonials() {
  const track = document.querySelector("[data-testimonials]");
  if (!track) return;
  const items = [...testimonials, ...testimonials, ...testimonials];
  track.innerHTML = items.map(([name, service, text]) => `<article class="card testimonial-card">
    <div class="stars">★★★★★</div>
    <p class="muted">"${text}"</p>
    <h3>${name}</h3>
    <span class="tag">${service}</span>
  </article>`).join("");
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });
  document.querySelectorAll(".reveal, .stat-card").forEach((node) => observer.observe(node));
}

function initAgenda() {
  const treatment = document.querySelector("#treatment");
  const professional = document.querySelector("#professional");
  const date = document.querySelector("#date");
  const time = document.querySelector("#time");
  const form = document.querySelector("#agendaForm");
  if (!form) return;

  treatment.innerHTML = services.map(([slug, title]) => `<option value="${title}">${title}</option>`).join("");
  professional.innerHTML = ["Dra. Claudia Zapata", "Dra. Marialexis", "Dra. Valentina Rojas", "Dra. Camila Fuentes"].map((name) => `<option>${name}</option>`).join("");
  time.innerHTML = ["09:00", "10:00", "11:30", "15:00", "16:30", "18:00"].map((hour) => `<option>${hour}</option>`).join("");
  date.min = new Date().toISOString().slice(0, 10);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const body = [
      "Solicitud de agenda Denticlass",
      "",
      `Paciente: ${data.get("name")}`,
      `Telefono: ${data.get("phone")}`,
      `Correo: ${data.get("email")}`,
      `Tratamiento: ${data.get("treatment")}`,
      `Profesional: ${data.get("professional")}`,
      `Fecha: ${data.get("date")}`,
      `Hora: ${data.get("time")}`,
      `Mensaje: ${data.get("message") || ""}`
    ].join("\n");
    window.location.href = `mailto:hola@centromedicodental.cl?subject=${encodeURIComponent("Solicitud de hora Denticlass")}&body=${encodeURIComponent(body)}`;
  });
}

function initMenu() {
  const button = document.querySelector("[data-menu]");
  const menu = document.querySelector(".mobile-nav");
  if (!button || !menu) return;
  button.addEventListener("click", () => menu.classList.toggle("open"));
}

document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initServices();
  initTestimonials();
  initAgenda();
  initReveal();
});
