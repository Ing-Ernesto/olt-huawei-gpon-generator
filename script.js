// ================================
// CONFIGURACION DE OLTs
// ================================

const OLTS = {
    "OLT_BIBLIAN": {
        vlan: "2140",
        user_vlan: "10",
        gemport: "1",
        line_profile: "10",
        service_profile: "10"
    },
    "OLT_DELEG": {
        vlan: "10",
        user_vlan: "10",
        gemport: "10",
        line_profile: "10",
        service_profile: "10"
    },
    "OLT_NUEVO_JADAN VLAN_2139": {
        vlan: "2139",
        user_vlan: "101",
        gemport: "10",
        line_profile: "10",
        service_profile: "10"
    },
    "OLT_ANTIGUO_JADAN VLAN_2138":{
        vlan: "2138",
        user_vlan: "101",
        gemport: "1",
        line_profile: "10",
        service_profile: "10"
    },
    "OLT_CHUQUIPATA": {
        vlan: "2138",
        user_vlan: "10",
        gemport: "1",
        line_profile: "10",
        service_profile: "10"
    },
    "OLT_SAN_PEDRO VLAN_10": {
        vlan: "10",
        user_vlan: "10",
        gemport: "12",
        line_profile: "12",
        service_profile: "12"
    },
    "OLT_RICAURTE": {
        vlan: "10",
        user_vlan: "10",
        gemport: "10",
        line_profile: "60",
        service_profile: "10"
    },
    "OLT_AZOGUES": {
        vlan: "925",
        user_vlan: "10",
        gemport: "10",
        line_profile: "90",
        service_profile: "10" //REVISADO HASTA EL NODO DE AZOGUES
    },
    "OLT_CAÑAR": {
        vlan: "526",
        user_vlan: "10",
        gemport: "10",
        line_profile: "10",
        service_profile: "10"
    },
    "OLT_MIRAFLORES": {
        vlan: "10",
        user_vlan: "10",
        gemport: "10",
        line_profile: "10",
        service_profile: "10"
    },
    "OLT_EL_PAN VLAN_110": {
        vlan: "110",
        user_vlan: "10",
        gemport: "10",
        line_profile: "10",
        service_profile: "10"
    },
    "OLT_EL_PAN VLAN_111": {
        vlan: "111",
        user_vlan: "10",
        gemport: "10",
        line_profile: "10",
        service_profile: "10"
    },
    "OLT_DESCANSO": {
        vlan:"10",
        user_vlan:"10",
        gemport:"10",
        line_profile:"10",
        service_profile:"10"
    }
};

// Cargar OLTs
const oltSelect = document.getElementById("olt");
Object.keys(OLTS).forEach(olt => {
    const option = document.createElement("option");
    option.value = olt;
    option.textContent = olt;
    oltSelect.appendChild(option);
});

// Generar Script
function generarScript() {
    const olt = OLTS[oltSelect.value];

    const frame = frameInput().value;
    const slot = slotInput().value;
    const port = portInput().value;
    const ontId = ontIdInput().value;
    const sn = snInput().value;
    const desc = descripcionInput().value;
    const sp = servicePortInput().value;

    if (!frame || !slot || !port || !ontId || !sn || !sp) {
        alert("Complete todos los campos obligatorios");
        return;
    }

    const script = `

interface gpon ${frame}/${slot}

ont add ${port} ${ontId} sn-auth "${sn}" omci \
ont-lineprofile-id ${olt.line_profile} \
ont-srvprofile-id ${olt.service_profile} \
desc "${desc}"

quit

service-port ${sp} vlan ${olt.vlan} gpon ${frame}/${slot}/${port} \
ont ${ontId} gemport ${olt.gemport} multi-service \
user-vlan ${olt.user_vlan} tag-transform translate

save

interface gpon ${frame}/${slot}

display ont optical-info ${port} ${ontId}
`.trim();

    document.getElementById("resultado").value = script;
}

// Copiar al portapapeles
function copiarScript() {
    const textarea = document.getElementById("resultado");
    if (!textarea.value) {
        alert("No hay script para copiar");
        return;
    }
    textarea.select();
    document.execCommand("copy");
    alert("Script copiado al portapapeles");
}

// Helpers
const frameInput = () => document.getElementById("frame");
const slotInput = () => document.getElementById("slot");
const portInput = () => document.getElementById("port");
const ontIdInput = () => document.getElementById("ont_id");
const snInput = () => document.getElementById("sn");
const descripcionInput = () => document.getElementById("descripcion");
const servicePortInput = () => document.getElementById("service_port");


// ================================
// VALIDACION DE FORMULARIO
// ================================

function validarFormulario() {
    const campos = [
        "frame",
        "slot",
        "port",
        "ont_id",
        "sn",
        "descripcion",
        "service_port"
    ];

    let completo = true;

    campos.forEach(id => {
        const input = document.getElementById(id);
        if (input.value.trim() === "") {
            input.classList.add("input-error");
            completo = false;
        } else {
            input.classList.remove("input-error");
        }
    });

    document.getElementById("btnGenerar").disabled = !completo;
}



// ================================
// LIMPIAR FORMULARIO
// ================================

function limpiarFormulario() {
    document.getElementById("frame").value = "";
    document.getElementById("slot").value = "";
    document.getElementById("port").value = "";
    document.getElementById("ont_id").value = "";
    document.getElementById("sn").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("service_port").value = "";
    document.getElementById("resultado").value = "";
}


// ================================
// MODO CLARO / OSCURO
// ================================

function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    actualizarIconoTema();
}

function actualizarIconoTema() {
    const theme = document.body.getAttribute("data-theme");
    const btn = document.querySelector(".theme-toggle");
    btn.textContent = theme === "dark" ? "🌙" : "☀";
}

// Cargar tema guardado
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.body.setAttribute("data-theme", savedTheme);
    actualizarIconoTema();
});
