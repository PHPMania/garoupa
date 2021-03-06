$(document).ready(function()
{
	var db;

	document.addEventListener('deviceready', function() {
	db = window.sqlitePlugin.openDatabase({name: 'database.db', location: 'default'});	
				
		//FAZENDA ATUAL
		db.transaction(function (tx) 
		{
			var query = "SELECT id_fazenda FROM t_fazenda_atual";

			tx.executeSql(query, [], function (tx, resultSet) 
			{
				var id_fazenda = resultSet.rows.item(0).id_fazenda;
				
				//FUNÇÃO LISTAR ESTADOS
				db.transaction(function (tx) 
				{
					var query = "SELECT * FROM t_estado_animal WHERE id_fazenda=? ORDER BY estado_animal ASC";

					tx.executeSql(query, [id_fazenda], function (tx, resultSet) 
					{ 
						var dataSet = []; 
						for(var x = 0; x < resultSet.rows.length; x++) 
						{											
							var dados = [resultSet.rows.item(x).estado_animal, '<a href="editEstados.html?id_estado_animal='+resultSet.rows.item(x).id_estado_animal+'"><img src="img/edit.png" class="iconeTable"></a>'];		
							
							dataSet.push(dados);
						}
						
						$('#lsEstados').DataTable({
						data: dataSet,
						"order": [[ 0, "desc" ]],
						columns: [
							{ title: "Estado" },
							{ title: "Editar" }
							]
						});							
					});
					
				});		  
				
				
				var getUrlParameter = function getUrlParameter(sParam) 
				{
					var sPageURL = decodeURIComponent(window.location.search.substring(1)),
					sURLVariables = sPageURL.split('?'),
					sParameterName,
					i;

					for (i = 0; i < sURLVariables.length; i++) {
					sParameterName = sURLVariables[i].split('=');

					if (sParameterName[0] === sParam) {
					return sParameterName[1] === undefined ? true : sParameterName[1];
					}
					}
				};
				
				var id_estado_animal = getUrlParameter('id_estado_animal');

				db.transaction(function (tx) 
				{
					var query = "SELECT * FROM t_estado_animal WHERE id_estado_animal=?";

					tx.executeSql(query, [id_estado_animal], function (tx, resultSet) 
					{ 
						$("#id_estado_animal").val(resultSet.rows.item(0).id_estado_animal);				
						$("#nomeED").val(resultSet.rows.item(0).estado_animal);
					});
						
				});
			
			});
		});
	});

	//FUNÇÃO CADASTRAR
	$("#incluirEstado").click(function() 
	{	
		var nome = $("#nome").val();

		if(nome != '')
		{
			db.transaction(function(tx, results) 
			{
				tx.executeSql("SELECT * FROM t_fazenda_atual", [], function (tx, resultSet) 
				{ 
					var id_fazenda = resultSet.rows.item(0).id_fazenda;						
				
					tx.executeSql("SELECT * FROM t_parametros", [], function (tx, resultSet) 
					{ 
						var hash = resultSet.rows.item(0).hash;				
						var user = resultSet.rows.item(0).usuario;
						var sync = 0;
						
						tx.executeSql('CREATE TABLE IF NOT EXISTS t_estado_animal (id_estado_animal INTEGER PRIMARY KEY AUTOINCREMENT, estado_animal text, hash text, user text, sync text, id_fazenda text)');
						tx.executeSql('INSERT INTO t_estado_animal VALUES (?,?,?,?,?,?)', [null, nome, hash, user, sync, id_fazenda]);
					});
				});
				
			}, function(error) {
			navigator.notification.alert(error.message, alertCallback,  'Notificação', 'OK');
			}, function() {
			navigator.notification.alert('Estado cadastrado com sucesso!', alertCallback,  'Notificação', 'OK');
			history.back();
			});			
		}
		else
		{
			navigator.notification.alert('Preencha o campo estado!', alertCallback,  'Notificação', 'OK');	
			$("#nome").focus();			
		}
		
	});
	
	//FUNÇÃO EDITAR
	$("#editarEstado").click(function() 
	{	
		var id        = $("#id_estado_animal").val();
		var nome      = $("#nomeED").val();

		if(nome != '')
		{
			db.transaction(function(tx, results) {                                  

			tx.executeSql("SELECT * FROM t_parametros", [], function (tx, resultSet) 
			{ 
				var hash = resultSet.rows.item(0).hash;				
				var user = resultSet.rows.item(0).usuario;
				
				tx.executeSql('UPDATE t_estado_animal SET estado_animal=?, hash=?, user=? WHERE id_estado_animal=?', [nome, hash, user, id]);
			});			
					
			}, function(error) {
			navigator.notification.alert(error.message, alertCallback,  'Notificação', 'OK');
			}, function() {
			navigator.notification.alert('Estyado editado com sucesso!', alertCallback,  'Notificação', 'OK');
			history.back();
			});					
		}
		else
		{
			navigator.notification.alert('Preencha o campo estado!', alertCallback,  'Notificação', 'OK');	
			$("#nomeED").focus();			
		}		
	});

	function alertCallback(){
		console.log("Alert is Dismissed!");
	}
		
});	




