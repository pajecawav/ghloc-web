import { Router } from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect } from "react";

let timer: number;
const delay = 250;

export const NavigationProgressBar = () => {
	useEffect(() => {
		const load = () => {
			// do not show progress bar if tranition takes less than 'delay' ms
			timer = window.setTimeout(() => {
				NProgress.start();
			}, delay);
		};

		const stop = () => {
			clearTimeout(timer);
			NProgress.done();
		};

		Router.events.on("routeChangeStart", load);
		Router.events.on("routeChangeComplete", stop);
		Router.events.on("routeChangeError", stop);

		return () => {
			Router.events.off("routeChangeStart", load);
			Router.events.off("routeChangeComplete", stop);
			Router.events.off("routeChangeError", stop);
			clearTimeout(timer);
		};
	}, []);

	return null;
};
