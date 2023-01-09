<?php

namespace App\Controller;

use App\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class CategoryController extends AbstractController
{
    /**
     * @param CategoryRepository $category
     * @return JsonResponse
     */
    public function getAll(CategoryRepository $category): JsonResponse
    {
        return $this->json([
            "accepted" => true,
            "result" => $category->getAllCategories()
        ]);
    }

    /**
     * @param CategoryRepository $category
     * @param $id
     * @return JsonResponse
     */
    public function getOne(CategoryRepository $category, $id): JsonResponse
    {
        $result = $category->getOneCategoryById($id);
        return $this->json([
            "accepted" => !(count($result) == 0),
            "result" => $result
        ]);
    }

    /**
     * @param CategoryRepository $category
     * @param Request $request
     * @return JsonResponse
     */
    public function add(CategoryRepository $category, Request $request): JsonResponse
    {
        $requestCategoryName = trim($request->request->get('category_name'));
        if ($requestCategoryName == null) {
            return $this->json([
                "accepted" => false,
                "result" => "Nazwa Kategorii jest wymagana"
            ]);
        }
        if (count($category->findBy(['category_name' => $requestCategoryName])) > 0) {
            return $this->json([
                "accepted" => false,
                "result" => "Kategoria o takiej nazwie już istnieje"
            ]);
        }
        $category->addCategory($requestCategoryName);
        return $this->json([
            "accepted" => true,
            "result" => "Kategoria została dodana"
        ]);
    }

    /**
     * @param $id
     * @param CategoryRepository $category
     * @param Request $request
     * @return JsonResponse
     */
    public function update($id, CategoryRepository $category, Request $request): JsonResponse
    {
        $requestCategoryName = trim($request->request->get('category_name'));
        if ($requestCategoryName == null) {
            return $this->json([
                "accepted" => false,
                "result" => "Nazwa Kategorii jest wymagana"
            ]);
        }
        if (count($category->findBy(['category_name' => $requestCategoryName])) > 0) {
            return $this->json([
                "accepted" => false,
                "result" => "Kategoria o takiej nazwie już istnieje"
            ]);
        }
        if (count($category->findBy(['id' => $id])) == 0) {
            return $this->json([
                "accepted" => false,
                "result" => "Kategoria o podanym id nie istnieje"
            ]);
        }
        $category->updateCategory($id, $requestCategoryName);
        return $this->json([
            "accepted" => true,
            "result" => "Kategoria została zaktualizowana"
        ]);
    }

    /**
     * @param $id
     * @param CategoryRepository $category
     * @return JsonResponse
     */
    public function delete($id, CategoryRepository $category): JsonResponse
    {
        $retrievedCategory = $category->findBy(['id' => $id]);
        if (count($retrievedCategory) == 0) {
            return $this->json([
                "accepted" => false,
                "result" => "Nie znaleziono kategorii o podanym id"
            ]);
        }
        $category->deleteCategory($id);
        return $this->json([
            "accepted" => true,
            "result" => "Kategoria zostało usunięte"
        ]);
    }
}