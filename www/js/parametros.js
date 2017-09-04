$(document).ready(function()
{
	senha = prompt("Digite a senha para acessar os parametros","");
	if (senha =="acpower")
	{
		document.getElementById('pagina').style.display = 'block';
	}
	else if(senha =="")
	{
		alert("Digite sua senha");window.location = "parametros.html" 
	}
	else if(senha =="sair")
	{
		window.location = "configuracoes.html"
	}
	else
	{
		alert("Senha incorreta");window.location = "parametros.html"
	}
	
	
	
	var db;

	document.addEventListener('deviceready', function() {
	db = window.sqlitePlugin.openDatabase({name: 'database.db', location: 'default'});	
				

		db.transaction(function (tx) 
		{
			var query = "SELECT * FROM t_parametros";

			tx.executeSql(query, [], function (tx, resultSet) 
			{ 
				$("#usuario").val(resultSet.rows.item(0).usuario);				
				$("#ip").val(resultSet.rows.item(0).ip);
			});
				
		});
	
	});

	//FUNÇÃO CADASTRAR
	$("#incluirParametro").click(function() 
	{	
		var usuario = $("#usuario").val();
		var ip 		= $("#ip").val();
		var hash    = Math.floor(Math.random() * 65536);

		if(usuario != '' && ip != '')
		{
			db.transaction(function(tx, results) {                                  
			tx.executeSql('DROP TABLE IF EXISTS t_parametros');
			tx.executeSql('CREATE TABLE IF NOT EXISTS t_parametros (usuario text, ip text, hash text)');
			tx.executeSql('INSERT INTO t_parametros VALUES (?,?,?)', [usuario, ip, hash]);
			
			}, function(error) {
			navigator.notification.alert(error.message, alertCallback,  'Notificação', 'OK');
			}, function() {
			navigator.notification.alert('Parametros cadastrados com sucesso!', alertCallback,  'Notificação', 'OK');
			});
		}
		else
		{
			navigator.notification.alert('Preencha o campo usuario!', alertCallback,  'Notificação', 'OK');	
			$("#usuario").focus();			
		}
	
		
	});
	
	function alertCallback(){
		console.log("Alert is Dismissed!");
	}
		
});	




