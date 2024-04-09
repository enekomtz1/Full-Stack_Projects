import React from "react";

import { logo } from "../assets";

const Hero = () => {
	return (
		<header className="w-full flex justify-center items-center flex-col">
			<nav className="flex justify-between items-center w-full mb-10 pt-3">
				<img src={logo} alt="sumz_logo" className="w-28 object-contain" />

				<button type="button" onClick={() => window.open("https://github.com/enekomtz1", "_blank")} className="black_btn">
					GitHub
				</button>
			</nav>

			<h1 className="head_text">
				Insight in an Instant
				<br className="max-md:hidden" />
				<span className="orange_gradient ">Summify Your Read</span>
			</h1>
			<h2 className="desc">Summify transforms lengthy articles into crisp, clear summaries, enabling you to grasp key insights in a fraction of the time.</h2>
		</header>
	);
};

export default Hero;
