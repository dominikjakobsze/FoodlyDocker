import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { getCookie } from "cookies-next";

export const useGetCitiesClient = ({ initialDataProp = null }) => {
  if (initialDataProp != null) {
    return useQuery(
      "cities",
      () => {
        return axios.get("http://localhost:3900/cities", {
          headers: { authtoken: getCookie("authtoken") },
        });
      },
      {
        enabled: false,
        initialData: initialDataProp,
      }
    );
  }
  return useQuery(
    "superHeroes",
    () => {
      return axios.get("http://localhost:3500/superheroes", {
        headers: { authtoken: getCookie("authtoken") },
      });
    },
    {
      enabled: true,
      cacheTime: 0,
      staleTime: 0,
      // select: (response) => {
      //   return response.data.map((superHero) => {
      //     return superHero.name;
      //   });
      // },
      // onSuccess: onSuccess,
      // onError: onError,
      //cacheTime: 1000 => 1s
      //staleTime: 1000 => 1s
      //refetchOnMount: true => default
      //refetchOnWindowFocus: true => default
      //refetchInterval: 1000 => 1s | false default
      //refetchIntervalInBackground: false => default
      //enabled: false => true is default, fetches when component mounts
    }
  );
};
