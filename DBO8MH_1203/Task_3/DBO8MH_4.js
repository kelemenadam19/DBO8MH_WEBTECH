$(document).ready(function () {
    $("#btn-calc").click(function () {
        let a = parseInt($("#numA").val());
        let b = parseInt($("#numB").val());
        let op = $("input[name='muv']:checked").val();
        let res = 0;

        if (isNaN(a) || isNaN(b)) {
            alert("Kérem adjon meg számokat!");
            return;
        }

        switch (op) {
            case 'add': res = a + b; break;
            case 'sub': res = a - b; break;
            case 'mul': res = a * b; break;
            case 'div':
                if (b === 0) { alert("Nullával nem osztunk!"); return; }
                res = a / b;
                break;
        }
        $("#eredmeny").text(res);
    });
});