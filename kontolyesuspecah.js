        const googleApiKey = "AIzaSyDay3FrR9lnPyCA66ZGPc_cUg-5KoxIhD8";
        const googleCx = "916804beab4fb4133";
        const youtubeApiKey = "AIzaSyBea6oG4T6FTNMgiVh8nux7d2HM89QHR0g";
        let userLoggedIn = false;
        function handleCredentialResponse(response) {
            const decodedToken = JSON.parse(atob(response.credential.split('.')[1]));
            alert(`Login Berhasil! Selamat datang, ${decodedToken.name}`);
            console.log("ID Token: ", response.credential);
            userLoggedIn = true;
            document.getElementById("google-search-container").style.display = "block";
            document.getElementById("youtube-search-container").style.display = "block";
        }
        function performGoogleSearch() {
            if (!userLoggedIn) {
                alert("Silakan login terlebih dahulu.");
                return;
            }
            const query = document.getElementById("google-query").value;
            const resultsDiv = document.getElementById("results");
            const loadingDiv = document.createElement("div");
            loadingDiv.classList.add("loading");
            resultsDiv.innerHTML = "";
            resultsDiv.appendChild(loadingDiv);
            resultsDiv.style.display = "block";
            fetch(`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${googleCx}&key=${googleApiKey}`)
                .then(response => response.json())
                .then(data => {
                    loadingDiv.remove();
                    if (data.items) {
                        resultsDiv.innerHTML = data.items.map(item => `
                            <div class="result-item">
                                <a href="${item.link}" target="_blank">${item.title}</a>
                                <p>${item.snippet}</p>
                            </div>
                        `).join('');
                    } else {
                        resultsDiv.innerHTML = "Tidak ada hasil.";
                    }
                });
        }
        function performYouTubeSearch() {
            if (!userLoggedIn) {
                alert("login dulu om untuk akses fitur search.");
                return;
            }
            const query = document.getElementById("youtube-query").value;
            const youtubeDiv = document.getElementById("youtube-results");
            const loadingDiv = document.createElement("div");
            loadingDiv.classList.add("loading");
            youtubeDiv.innerHTML = "";
            youtubeDiv.appendChild(loadingDiv);
            youtubeDiv.style.display = "block";
            fetch(`https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(query)}&key=${youtubeApiKey}&part=snippet&type=video`)
                .then(response => response.json())
                .then(data => {
                    loadingDiv.remove();
                    if (data.items) {
                        youtubeDiv.innerHTML = data.items.map(item => `
                            <div class="youtube-item">
                                <iframe src="https://www.youtube.com/embed/${item.id.videoId}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </div>
                        `).join('');
                    } else {
                        youtubeDiv.innerHTML = "Tidak ada hasil.";
                    }
                });
        }
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let particles = [];
        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 5 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.size > 0.2) this.size -= 0.1;
            }
            draw() {
                ctx.fillStyle = "rgba(0, 255, 0, 0.8)";
                ctx.strokeStyle = "rgba(0, 255, 0, 0.8)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        function createParticles(event) {
            const xPos = event.x;
            const yPos = event.y;
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(xPos, yPos));
            }
        }
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((particle, index) => {
                particle.update();
                particle.draw();
                if (particle.size <= 0.2) {
                    particles.splice(index, 1);
                }
            });
            requestAnimationFrame(animateParticles);
        }
        canvas.addEventListener("mousemove", createParticles);
        animateParticles();