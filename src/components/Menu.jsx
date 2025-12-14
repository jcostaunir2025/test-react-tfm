import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const menuData = [
	{ to: "/", label: "Inicio", icon: "home" },
	{ to: "/evaluaciones", label: "Evaluaciones", icon: "clipboard" },
	{ to: "/reportes", label: "Reportes", icon: "chart" },
	{
		to: "/configuracion",
		label: "Configuración",
		icon: "cog",
		children: [
			{ to: "/configuracion/perfil", label: "Perfil", icon: "user" },
			{ to: "/configuracion/seguridad", label: "Seguridad", icon: "lock" },
		],
	},
	{ to: "/ayuda", label: "Ayuda", icon: "help" },
];

function Icon({ name }) {
	switch (name) {
		case "home":
			return (
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					aria-hidden
				>
					<path
						d="M3 11.5L12 4l9 7.5"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M5 12v7a1 1 0 001 1h3v-5h6v5h3a1 1 0 001-1v-7"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			);
		case "clipboard":
			return (
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					aria-hidden
				>
					<rect
						x="8"
						y="2"
						width="8"
						height="4"
						rx="1"
						stroke="currentColor"
						strokeWidth="1.5"
					/>
					<rect
						x="4"
						y="6"
						width="16"
						height="14"
						rx="2"
						stroke="currentColor"
						strokeWidth="1.5"
					/>
				</svg>
			);
		case "chart":
			return (
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					aria-hidden
				>
					<path
						d="M12 20V10"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M18 20V4"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M6 20v-6"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			);
		case "cog":
			return (
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					aria-hidden
				>
					<path
						d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09c.7 0 1.26-.4 1.51-1a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06c.5.3 1.1.3 1.82.33h.09A1.65 1.65 0 0010 3.09V3a2 2 0 014 0v.09c.7 0 1.26.4 1.51 1 .2.5.2 1.1.33 1.82h.09a2 2 0 012.83 2.83l-.06.06c-.3.5-.3 1.1-.33 1.82V9c0 .58.27 1.12.72 1.48z"
						stroke="currentColor"
						strokeWidth="1.2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			);
		case "user":
			return (
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					aria-hidden
				>
					<path
						d="M20 21v-2a4 4 0 00-3-3.87"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M4 21v-2a4 4 0 013-3.87"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M12 7a4 4 0 110-8 4 4 0 010 8z"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			);
		case "lock":
			return (
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					aria-hidden
				>
					<rect
						x="3"
						y="11"
						width="18"
						height="11"
						rx="2"
						stroke="currentColor"
						strokeWidth="1.5"
					/>
					<path
						d="M7 11V7a5 5 0 0110 0v4"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			);
		case "help":
			return (
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					aria-hidden
				>
					<path
						d="M12 18h.01"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M9.09 9a3 3 0 115.82 0c0 2-3 2.5-3 4"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" />
				</svg>
			);
		default:
			return null;
	}
}

export default function Menu() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [openIndex, setOpenIndex] = useState(null);
	const navRef = useRef(null);

	const toggleItem = (idx) => {
		setOpenIndex((v) => (v === idx ? null : idx));
	};

	const closeMenu = () => {
		setMenuOpen(false);
		setOpenIndex(null);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (navRef.current && !navRef.current.contains(event.target)) {
				closeMenu();
			}
		};

		const handleEscape = (event) => {
			if (event.key === "Escape") {
				closeMenu();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscape);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscape);
		};
	}, [navRef]);

	return (
		<nav className="bg-white" ref={navRef}>
			{/* hamburger moved outside container to stick to left edge */}
			<button
				className="menu-toggle md:hidden absolute left-4 top-4 z-50"
				aria-label="Toggle menu"
				onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
				aria-expanded={menuOpen}
			>
				{menuOpen ? (
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						aria-hidden
					>
						<path
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				) : (
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						aria-hidden
					>
						<path
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				)}
			</button>

			<div className="container-max">
				<div className="nav-bar-row">
					{/* empty placeholder to keep layout balanced on desktop */}
					<div style={{ width: 40 }}></div>
				</div>

				<ul
					className={`nav-list ${menuOpen ? "open force-open" : ""}`}
					id="menu"
					aria-controls="menu"
					aria-hidden={!menuOpen}
					style={{
						maxHeight: menuOpen ? '800px' : '0',
						opacity: menuOpen ? 1 : 0,
						overflow: 'hidden',
						transition: 'max-height 320ms ease, opacity 220ms ease'
					}}
				>
					{menuData.map((item, idx) => (
						<li
							key={item.to}
							className={`nav-item ${openIndex === idx ? "open" : ""}`}
						>
							{item.children ? (
								<>
									<button
										className={`nav-link-button`}
										onClick={() => toggleItem(idx)}
										aria-expanded={openIndex === idx}
									>
										<span
											style={{
												display: "inline-flex",
												marginRight: 8,
											}}
											aria-hidden
										>
											<Icon name={item.icon} />
										</span>
										{item.label}
										<span style={{ marginLeft: 8 }} aria-hidden>
											▾
										</span>
									</button>

									<div className="dropdown" role="menu">
										{item.children.map((c) => (
											<NavLink
												key={c.to}
												to={c.to}
												className={({ isActive }) =>
													isActive ? "nav-link-active" : ""
												}
												onClick={closeMenu}
											>
												<span
													style={{
														display: "inline-flex",
														marginRight: 8,
													}}
													aria-hidden
												>
													<Icon name={c.icon} />
												</span>
												{c.label}
											</NavLink>
										))}
									</div>
								</>
							) : (
								<NavLink
									to={item.to}
									className={({ isActive }) =>
										isActive
											? "nav-link-button nav-link-active"
											: "nav-link-button"
									}
									onClick={closeMenu}
								>
									<span
										style={{
											display: "inline-flex",
											marginRight: 8,
										}}
										aria-hidden
									>
										<Icon name={item.icon} />
									</span>
									{item.label}
								</NavLink>
							)}
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
}