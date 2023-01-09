<?php

namespace App\Controller;

use App\Repository\CityRepository;
use App\Service\FileService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class CityController extends AbstractController
{
    public function getAll(CityRepository $city): JsonResponse
    {
        return $this->json([
            "accepted" => true,
            "result" => $city->getAllCities()
        ]);
    }

    public function getOne($id, CityRepository $city): JsonResponse
    {
        $result = $city->getOneCityById($id);
        return $this->json([
            "accepted" => !(count($result) == 0),
            "result" => $result
        ]);
    }

    public function add(Request $request, CityRepository $city, FileService $file): JsonResponse
    {
        $image = $request->files->get('city_image');
        if ($image == null) {
            return $this->json([
                "accepted" => false,
                "result" => "Brak zdjęcia"
            ]);
        }
        $requestCityName = trim($request->request->get('city_name'));
        if ($requestCityName == null) {
            return $this->json([
                "accepted" => false,
                "result" => "Nazwa miasta jest wymagana"
            ]);
        }
        if (count($city->findBy(['city_name' => $requestCityName])) > 0) {
            return $this->json([
                "accepted" => false,
                "result" => "Miasto o takiej nazwie już istnieje"
            ]);
        }
        if (!$file->checkIfFileIsImage($image)) {
            return $this->json([
                "accepted" => false,
                "result" => "To nie jest zdjęcie"
            ]);
        }
        $newFileName = $file->generateNameForFile($image);
        $file->upload($image, $newFileName, "cities");
        $city->addCity($requestCityName, $newFileName);
        return $this->json([
            "accepted" => true,
            "result" => "Miasto " . $requestCityName . " zostało dodane"
        ]);
    }

    public function update($id, Request $request, CityRepository $city, FileService $file): JsonResponse
    {
        $requestCityName = trim((string)$request->request->get('city_name'));
        if ($requestCityName == null) {
            return $this->json([
                "accepted" => false,
                "result" => "Nazwa miasta jest wymagana"
            ]);
        }
        $image = $request->files->get('city_image');
        if ($image == null) {
            return $this->json([
                "accepted" => false,
                "result" => "Brak zdjęcia"
            ]);
        }
        if (count($city->findBy(['city_name' => $requestCityName])) > 0) {
            return $this->json([
                "accepted" => false,
                "result" => "Miasto o takiej nazwie już istnieje"
            ]);
        }
        if (count($city->getOneCityById($id)) == 0) {
            return $this->json([
                "accepted" => false,
                "result" => "Nie znaleziono miasta o podanym id"
            ]);
        }
        $newFileName = $file->generateNameForFile($image);
        $file->upload($image, $newFileName, "cities");
        $city->updateCity($id, $requestCityName, $newFileName);
        return $this->json([
            "accepted" => true,
            "result" => "Zmieniono nazwę na: " . $requestCityName
        ]);
    }

    public function delete($id, CityRepository $city): JsonResponse
    {
        $retrievedCity = $city->getOneCityById($id);
        if (count($retrievedCity) == 0) {
            return $this->json([
                "accepted" => false,
                "result" => "Nie znaleziono miasta o podanym id"
            ]);
        }
        $city->deleteCity($id);
        return $this->json([
            "accepted" => true,
            "result" => "Miasto zostało usunięte"
        ]);
    }
}