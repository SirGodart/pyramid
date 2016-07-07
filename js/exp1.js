(function () {

				var counter = 0;
			var dummy = new THREE.Object3D();
			var world = new THREE.Object3D();

			var iso3D = new THREE.Object3D();
			 var loader1 = new THREE.JSONLoader();


			var SCREEN_WIDTH = window.innerWidth,
			SCREEN_HEIGHT = window.innerHeight,

			mouseX = 0, mouseY = 0,

			windowHalfX = window.innerWidth / 2,
			windowHalfY = window.innerHeight / 2,

			SEPARATION = 200,
			AMOUNTX = 10,
			AMOUNTY = 10,

			camera, scene, renderer, cameraCube;

			var shaderMesh;

			init();
			animate();







			function init() {

				var container, separation = 100, amountX = 50, amountY = 50,
				particles, particle;

				container = document.createElement('div');
				document.body.appendChild(container);

				camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
				cameraCube = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 100000 );

				camera.position.z = 1000;

				scene = new THREE.Scene();
				sceneCube = new THREE.Scene();




		    //LIGHTNING
				var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
				hemiLight.color.setHSL( 3.6, 1, 0.6 );
				hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
				hemiLight.position.set( 3, 3, 1 );
				scene.add( hemiLight );


				var dirLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
				dirLight.color.setHSL( 0.1, 1, 0.95 );
			hemiLight.position.set( 3, 3, 1 );
				dirLight.position.multiplyScalar( 50 );
				scene.add( dirLight );

				dirLight.castShadow = true;
				dirLight.shadowMapWidth = 2048;
				dirLight.shadowMapHeight = 2048;
				var d = 50;
				dirLight.shadowCameraLeft = -d;
				dirLight.shadowCameraRight = d;
				dirLight.shadowCameraTop = d;
				dirLight.shadowCameraBottom = -d;
				dirLight.shadowCameraFar = 3500;
				dirLight.shadowBias = -0.0001;
				dirLight.shadowDarkness = 0.35;




				// particles

				var PI2 = Math.PI * 2;
				var material = new THREE.SpriteCanvasMaterial( {

					color: 0xffffff,
					program: function ( context ) {

						context.beginPath();
						context.arc( 0, 0, 0.5, 0, PI2, true );
						context.fill();

					}

				} );





			var spec = 0x333333;
            var shine = 50;


            // ---------------------


            var path = "images/";
				var format = '.jpg';
				var urls = [
					path + 'posx' + format, path + 'negx' + format,
					path + 'posy' + format, path + 'negy' + format,
					path + 'posz' + format, path + 'negz' + format
				];

				var textureCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );
				var sMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube, refractionRatio: 0.90, reflectivity:0.99 } );
    
 			

				var shader = THREE.ShaderLib[ "cube" ];
				shader.uniforms[ "tCube" ].value = textureCube;

				var shaderMaterial = new THREE.ShaderMaterial( {

					fragmentShader: shader.fragmentShader,
					vertexShader: shader.vertexShader,
					uniforms: shader.uniforms,
					side: THREE.BackSide

				} );

				shaderMesh = new THREE.Mesh( new THREE.BoxGeometry( 10000, 10000, 10000 ), shaderMaterial );
				shaderMesh.position.y = 0;

			

				world.add( shaderMesh );




				sceneCube.add( world );





		

				
 	 // ---------------------

 			//THREE MODEL LOADERS
			 // loader1 = new THREE.JSONLoader();
    		 loader1.load( "models/head.json", function(geometry){

	    			   
                         geometry.computeMorphNormals();

						 var material = new THREE.MeshPhongMaterial( { color: "black", specular: spec, shininess: shine, vertexColors: THREE.FaceColors} );
                         var mesh = new THREE.Mesh(geometry, sMaterial);

                    	//var mesh = new THREE.Mesh( geometry, sMaterial);

                         //mesh.position.set(0, 0, 0);
                         //mesh.scale.set(10, 10, 10);
                         var z = 0;
                         var s = 25;
                         mesh.position.y = 50;
                         mesh.position.z = z;
						mesh.scale.x = mesh.scale.y = mesh.scale.z = s;
                  
                        dummy.add( mesh );	
                        dummy.position.set( 0, 0, 0 );
                 			
						scene.add( dummy );
						console.log('lol');
				 
			
				    });

				for ( var i = 0; i < 2000; i ++ ) {

					particle = new THREE.Sprite(  );
					particle.position.x = Math.random() * 2 - 1;
					particle.position.y = Math.random() * 2 - 1;
					particle.position.z = Math.random() * 2 - 1;

					particle.opacity = 0.2;
					//particle.position.normalize();
					particle.position.multiplyScalar( Math.random() * 20 + 1000 );
					particle.scale.multiplyScalar( 0.5 );
					//scene.add( particle );


				}

				// lines



				for ( var i = 0; i < 10; i++) {

				var isoGeo = new THREE.OctahedronGeometry(250, 0);
				var isoMesh = new THREE.Mesh( isoGeo, new THREE.MeshBasicMaterial( { transparent: true, color: 0xfefefe, wireframe: true, opacity: 0.05 + i/50 } ) );
				isoMesh.scale.set(3 - i/10  , 3- i/10 , 3- i/10 );
				iso3D.add( isoMesh );
				scene.add( iso3D );
				

			}

		



				renderer = new THREE.WebGLRenderer({alpha: true});
				renderer.setClearColor( '#000' , 0.0 );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
				container.appendChild( renderer.domElement );

				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				cameraCube.aspect = window.innerWidth / window.innerHeight;
				cameraCube.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			//

			function onDocumentMouseMove(event) {

				mouseX = event.clientX - windowHalfX;
				mouseY = event.clientY - windowHalfY;
			}

			function onDocumentTouchStart( event ) {

				if ( event.touches.length > 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;

				}

			}

			function onDocumentTouchMove( event ) {

				if ( event.touches.length == 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;

				}

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();

			}

		

			function render() {
		counter += 0.05;


				camera.position.x += ( mouseX - camera.position.x ) * .05;
				camera.position.y += ( - mouseY - 200 - camera.position.y ) * .05;
				camera.lookAt( scene.position );

				//cameraCube.lookAt( sceneCube.position );

		


			//scene.children[3].rotation.y += 0.01;

			for (var i = 0; i < iso3D.children.length; i++) {


			//iso3D.children[i].rotation.y = Math.cos(counter - (i/1.5)) * Math.PI/180 +  i/100;
			iso3D.children[i].scale.y = iso3D.children[i].scale.x = iso3D.children[i].scale.z = (Math.cos(counter/2  + (i/15))) * 2;
			//iso3D.children[i].rotation.x = Math.sin(counter - (i/1.5)) * Math.PI/180 +  i/100;
	



/*
				if (iso3D.children[i].rotation.y >= (Math.PI/180 * 30)) {
					iso3D.children[i].rotation.y = Math.PI/180 * 30;
					iso3D.children[i].rotation.y -= 0.01 + i/500;
				}

*/

			}

		
			//dummy.rotation.y += 0.04;
	

				dummy.rotation.y += (camera.position.x / 1000) - dummy.rotation.y;
				//dummy.rotation.x += (-camera.position.y / 2000) - dummy.rotation.x;


				//shaderMesh.rotation.y -= 0.6;
				renderer.clear();
				
				renderer.render( sceneCube, cameraCube );
				
				renderer.render( scene, camera );



				


			}



			})();
