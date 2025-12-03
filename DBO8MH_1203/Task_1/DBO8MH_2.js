$(document).ready(function () {
    $("#btn-load").click(function () {
        $.ajax({
            url: "DBO8MH_orarend.json",
            dataType: "json",
            success: function (data) {

                let headerInfo = `<p>Cím: ${data.cim.iranyitoszam} ${data.cim.varos}, ${data.cim.utca}</p>`;
                headerInfo += `<p>Telefon (${data.telefonszam[0].tipus}): ${data.telefonszam[0].szam}</p>`;
                $("#fejlec_adatok").html(headerInfo);

                let output = "<h2>Órarend</h2>";
                $.each(data.kurzus, function (index, k) {
                    output += `<div class="kurzus-doboz">
                        <h3>${k.targy}</h3>
                        <p><strong>Időpont:</strong> ${k.idopont.nap}, ${k.idopont.tol}-${k.idopont.ig}</p>
                        <p><strong>Helyszín:</strong> ${k.helyszin}</p>
                        <p><strong>Oktató:</strong> ${k.oktato}</p>
                    </div><hr>`;
                });
                $("#TERULET").html(output);
            },
            error: function () {
                alert("Hiba a JSON betöltésekor! (Használj Live Servert vagy engedélyezd a helyi fájl hozzáférést)");
            }
        });
    });
});