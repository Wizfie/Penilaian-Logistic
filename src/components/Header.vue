<template lang="">
	<!-- ======= Header ======= -->
	<header id="header" class="header fixed-top d-flex align-items-center">
		<div class="d-flex align-items-center justify-content-between">
			<router-link to="/dashboard">
				<a class="logo d-flex align-items-center">
					<img src="../assets/img/gt-logo.png" alt="" />
					<span class="d-none d-lg-block ms-2">Logistic</span>
				</a>
			</router-link>
			<i class="bi bi-list toggle-sidebar-btn"></i>
		</div>
		<!-- End Logo -->

		<nav class="header-nav ms-auto me-3">
			<ul class="d-flex align-items-center">
				<!-- End Search Icon-->

				<li class="nav-item dropdown">
					<a
						class="nav-link nav-profile d-flex align-items-center pe-0"
						href="#"
						data-bs-toggle="dropdown"
					>
						<img
							src="../assets/img/profile.png"
							alt="Profile"
							class="rounded-circle"
						/>

						<span class="d-none d-md-block dropdown-toggle ps-2">{{
							profileName.toUpperCase()
						}}</span> </a
					><!-- End Profile Iamge Icon -->

					<ul
						class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile"
					>
						<li class="dropdown-header">
							<h6>{{ profileName.toUpperCase() }}</h6>
							<!-- <span>Web Designer</span> -->
						</li>

						<li>
							<a
								class="dropdown-item d-flex align-items-center d-none"
								href="users-profile.html"
							>
								<i class="bi bi-person"></i>
								<span>My Profile</span>
							</a>
						</li>
						<li>
							<hr class="dropdown-divider" />
						</li>

						<!-- <li>
							<a
								class="dropdown-item d-flex align-items-center"
								href="users-profile.html"
							>
								<i class="bi bi-gear"></i>
								<span>Account Settings</span>
							</a>
						</li>
						<li>
							<hr class="dropdown-divider" />
						</li> -->

						<!-- <li>
							<a
								class="dropdown-item d-flex align-items-center"
								href="pages-faq.html"
							>
								<i class="bi bi-question-circle"></i>
								<span>Need Help?</span>
							</a>
						</li>
						<li>
							<hr class="dropdown-divider" />
						</li> -->

						<li>
							<a
								@click="signOut"
								class="dropdown-item d-flex align-items-center"
								href="#"
							>
								<i class="bi bi-box-arrow-right"></i>
								<span>Sign Out</span>
							</a>
						</li>
					</ul>
					<!-- End Profile Dropdown Items -->
				</li>
				<!-- End Profile Nav -->
			</ul>
		</nav>
		<!-- End Icons Navigation -->
	</header>
	<!-- End Header -->
	<!-- ======= Sidebar ======= -->
	<aside id="sidebar" class="sidebar">
		<ul class="sidebar-nav" id="sidebar-nav">
			<li class="nav-item">
				<router-link class="nav-link" to="/dashboard">
					<i class="bi bi-grid"></i>
					<span>Dashboard</span>
				</router-link>
			</li>
			<!-- End Dashboard Nav -->

			<li class="nav-item">
				<a
					class="nav-link collapsed"
					data-bs-target="#components-nav"
					data-bs-toggle="collapse"
					href="#"
				>
					<i class="bi bi-star-fill"></i><span>Penilaian</span
					><i class="bi bi-chevron-down ms-auto"></i>
				</a>
				<ul
					id="components-nav"
					class="nav-content collapse"
					data-bs-parent="#sidebar-nav"
				>
					<li>
						<router-link to="/penilaian-lapangan">
							<i class="bi bi-circle-fill"></i><span>Penjurian Lapangan</span>
						</router-link>
					</li>
					<li>
						<router-link to="/presentasi">
							<i class="bi bi-circle-fill"></i><span>Penjurian Presentasi</span>
						</router-link>
					</li>
					<li>
						<router-link to="/Penilaian-yelyel">
							<i class="bi bi-circle-fill"></i><span>Penjurian Yel-Yel</span>
						</router-link>
					</li>
				</ul>
			</li>

			<!-- End Penjurian Nav -->

			<li v-if="role === 'admin'" class="nav-item">
				<a
					class="nav-link collapsed"
					data-bs-target="#forms-nav"
					data-bs-toggle="collapse"
					href="#"
				>
					<i class="bi bi-journal-text"></i><span>Admin Panel</span
					><i class="bi bi-chevron-down ms-auto"></i>
				</a>
				<ul
					id="forms-nav"
					class="nav-content collapse"
					data-bs-parent="#sidebar-nav"
				>
					<li v-if="role === `admin`">
						<router-link to="/history-lapangan-admin">
							<i class="bi bi-circle-fill"></i><span>History Lapangan</span>
						</router-link>
					</li>
					<li v-if="role === `admin`">
						<router-link to="/history-presentasi-admin">
							<i class="bi bi-circle-fill"></i><span>History Presentasi</span>
						</router-link>
					</li>
					<li v-if="role === `admin`">
						<router-link to="/history-yelyel-admin">
							<i class="bi bi-circle-fill"></i><span>History Yel-Yel</span>
						</router-link>
					</li>
				</ul>
			</li>

			<li class="nav-heading"><hr /></li>
			<!-- <li class="nav-heading">Page</li> -->

			<li class="nav-item">
				<a class="nav-link collapsed d-none" href="users-profile.html">
					<i class="bi bi-person"></i>
					<span>Profile</span>
				</a>
			</li>
			<!-- End Profile Page Nav -->

			<li class="nav-item" @click="signOut">
				<a class="nav-link collapsed">
					<i class="bi bi-box-arrow-left"></i>
					<span>Log Out</span>
				</a>
			</li>
			<!-- End Sign out Page Nav -->
		</ul>
	</aside>
	<!-- End Sidebar-->
</template>
<script>
	export default {
		data() {
			return {
				profileName: null,
				role: null,
			};
		},
		methods: {
			signOut() {
				if (confirm("Logged Out?")) {
					localStorage.clear("userData");
					this.$router.push("/");
				}
			},
		},
		mounted() {
			(function () {
				"use strict";

				/**
				 * Easy selector helper function
				 */
				const select = (el, all = false) => {
					el = el.trim();
					if (all) {
						return [...document.querySelectorAll(el)];
					} else {
						return document.querySelector(el);
					}
				};

				/**
				 * Easy event listener function
				 */
				const on = (type, el, listener, all = false) => {
					if (all) {
						select(el, all).forEach((e) => e.addEventListener(type, listener));
					} else {
						select(el, all).addEventListener(type, listener);
					}
				};

				/**
				 * Easy on scroll event listener
				 */
				const onscroll = (el, listener) => {
					el.addEventListener("scroll", listener);
				};

				/**
				 * Sidebar toggle
				 */
				if (select(".toggle-sidebar-btn")) {
					on("click", ".toggle-sidebar-btn", function (e) {
						select("body").classList.toggle("toggle-sidebar");
					});
				}

				/**
				 * Search bar toggle
				 */
				if (select(".search-bar-toggle")) {
					on("click", ".search-bar-toggle", function (e) {
						select(".search-bar").classList.toggle("search-bar-show");
					});
				}

				/**
				 * Navbar links active state on scroll
				 */
				let navbarlinks = select("#navbar .scrollto", true);
				const navbarlinksActive = () => {
					let position = window.scrollY + 200;
					navbarlinks.forEach((navbarlink) => {
						if (!navbarlink.hash) return;
						let section = select(navbarlink.hash);
						if (!section) return;
						if (
							position >= section.offsetTop &&
							position <= section.offsetTop + section.offsetHeight
						) {
							navbarlink.classList.add("active");
						} else {
							navbarlink.classList.remove("active");
						}
					});
				};
				window.addEventListener("load", navbarlinksActive);
				onscroll(document, navbarlinksActive);

				/**
				 * Toggle .header-scrolled class to #header when page is scrolled
				 */
				let selectHeader = select("#header");
				if (selectHeader) {
					const headerScrolled = () => {
						if (window.scrollY > 100) {
							selectHeader.classList.add("header-scrolled");
						} else {
							selectHeader.classList.remove("header-scrolled");
						}
					};
					window.addEventListener("load", headerScrolled);
					onscroll(document, headerScrolled);
				}

				/**
				 * Back to top button
				 */
				let backtotop = select(".back-to-top");
				if (backtotop) {
					const toggleBacktotop = () => {
						if (window.scrollY > 100) {
							backtotop.classList.add("active");
						} else {
							backtotop.classList.remove("active");
						}
					};
					window.addEventListener("load", toggleBacktotop);
					onscroll(document, toggleBacktotop);
				}

				/**
				 * Initiate tooltips
				 */
				var tooltipTriggerList = [].slice.call(
					document.querySelectorAll('[data-bs-toggle="tooltip"]')
				);
				var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
					return new bootstrap.Tooltip(tooltipTriggerEl);
				});

				/**
				 * Initiate quill editors
				 */
				if (select(".quill-editor-default")) {
					new Quill(".quill-editor-default", {
						theme: "snow",
					});
				}

				if (select(".quill-editor-bubble")) {
					new Quill(".quill-editor-bubble", {
						theme: "bubble",
					});
				}

				if (select(".quill-editor-full")) {
					new Quill(".quill-editor-full", {
						modules: {
							toolbar: [
								[
									{
										font: [],
									},
									{
										size: [],
									},
								],
								["bold", "italic", "underline", "strike"],
								[
									{
										color: [],
									},
									{
										background: [],
									},
								],
								[
									{
										script: "super",
									},
									{
										script: "sub",
									},
								],
								[
									{
										list: "ordered",
									},
									{
										list: "bullet",
									},
									{
										indent: "-1",
									},
									{
										indent: "+1",
									},
								],
								[
									"direction",
									{
										align: [],
									},
								],
								["link", "image", "video"],
								["clean"],
							],
						},
						theme: "snow",
					});
				}

				/**
				 * Initiate TinyMCE Editor
				 */
				// const useDarkMode = window.matchMedia(
				// 	"(prefers-color-scheme: dark)"
				// ).matches;
				// const isSmallScreen = window.matchMedia(
				// 	"(max-width: 1023.5px)"
				// ).matches;

				// tinymce.init({
				// 	selector: "textarea.tinymce-editor",
				// 	plugins:
				// 		"preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons",
				// 	editimage_cors_hosts: ["picsum.photos"],
				// 	menubar: "file edit view insert format tools table help",
				// 	toolbar:
				// 		"undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl",
				// 	toolbar_sticky: true,
				// 	toolbar_sticky_offset: isSmallScreen ? 102 : 108,
				// 	autosave_ask_before_unload: true,
				// 	autosave_interval: "30s",
				// 	autosave_prefix: "{path}{query}-{id}-",
				// 	autosave_restore_when_empty: false,
				// 	autosave_retention: "2m",
				// 	image_advtab: true,
				// 	link_list: [
				// 		{
				// 			title: "My page 1",
				// 			value: "https://www.tiny.cloud",
				// 		},
				// 		{
				// 			title: "My page 2",
				// 			value: "http://www.moxiecode.com",
				// 		},
				// 	],
				// 	image_list: [
				// 		{
				// 			title: "My page 1",
				// 			value: "https://www.tiny.cloud",
				// 		},
				// 		{
				// 			title: "My page 2",
				// 			value: "http://www.moxiecode.com",
				// 		},
				// 	],
				// 	image_class_list: [
				// 		{
				// 			title: "None",
				// 			value: "",
				// 		},
				// 		{
				// 			title: "Some class",
				// 			value: "class-name",
				// 		},
				// 	],
				// 	importcss_append: true,
				// 	file_picker_callback: (callback, value, meta) => {
				// 		/* Provide file and text for the link dialog */
				// 		if (meta.filetype === "file") {
				// 			callback("https://www.google.com/logos/google.jpg", {
				// 				text: "My text",
				// 			});
				// 		}

				// 		/* Provide image and alt text for the image dialog */
				// 		if (meta.filetype === "image") {
				// 			callback("https://www.google.com/logos/google.jpg", {
				// 				alt: "My alt text",
				// 			});
				// 		}

				// 		/* Provide alternative source and posted for the media dialog */
				// 		if (meta.filetype === "media") {
				// 			callback("movie.mp4", {
				// 				source2: "alt.ogg",
				// 				poster: "https://www.google.com/logos/google.jpg",
				// 			});
				// 		}
				// 	},
				// 	templates: [
				// 		{
				// 			title: "New Table",
				// 			description: "creates a new table",
				// 			content:
				// 				'<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>',
				// 		},
				// 		{
				// 			title: "Starting my story",
				// 			description: "A cure for writers block",
				// 			content: "Once upon a time...",
				// 		},
				// 		{
				// 			title: "New list with dates",
				// 			description: "New List with dates",
				// 			content:
				// 				'<div class="mceTmpl"><span class="cdate">cdate</span><br><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>',
				// 		},
				// 	],
				// 	template_cdate_format: "[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]",
				// 	template_mdate_format: "[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]",
				// 	height: 600,
				// 	image_caption: true,
				// 	quickbars_selection_toolbar:
				// 		"bold italic | quicklink h2 h3 blockquote quickimage quicktable",
				// 	noneditable_class: "mceNonEditable",
				// 	toolbar_mode: "sliding",
				// 	contextmenu: "link image table",
				// 	skin: useDarkMode ? "oxide-dark" : "oxide",
				// 	content_css: useDarkMode ? "dark" : "default",
				// 	content_style:
				// 		"body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
				// });

				/**
				 * Initiate Bootstrap validation check
				 */
				var needsValidation = document.querySelectorAll(".needs-validation");

				Array.prototype.slice.call(needsValidation).forEach(function (form) {
					form.addEventListener(
						"submit",
						function (event) {
							if (!form.checkValidity()) {
								event.preventDefault();
								event.stopPropagation();
							}

							form.classList.add("was-validated");
						},
						false
					);
				});

				/**
				 * Initiate Datatables
				 */
				// const datatables = select(".datatable", true);
				// datatables.forEach((datatable) => {
				// 	new simpleDatatables.DataTable(datatable);
				// });

				/**
				 * Autoresize echart charts
				 */
				const mainContainer = select("#main");
				if (mainContainer) {
					setTimeout(() => {
						new ResizeObserver(function () {
							select(".echart", true).forEach((getEchart) => {
								echarts.getInstanceByDom(getEchart).resize();
							});
						}).observe(mainContainer);
					}, 200);
				}
			})();
		},

		created() {
			const userData = JSON.parse(localStorage.getItem("userData"));
			if (userData) {
				this.profileName = userData.username;
				this.role = userData.role;
			}
		},
	};
</script>
<style></style>
