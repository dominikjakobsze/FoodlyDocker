<?php

namespace App\Service;

use Symfony\Component\HttpKernel\KernelInterface;

class FileService
{
    private $appKernel;

    public function __construct(KernelInterface $appKernel)
    {
        $this->appKernel = $appKernel;
    }

    /**
     * @param $file
     * @return bool
     */
    public function checkIfFileIsImage($file): bool
    {
        $fileType = $file->getMimeType();
        return $fileType == 'image/jpeg' || $fileType == 'image/png';
    }

    /**
     * @param $file
     * @return string
     */
    public function generateNameForFile($file): string
    {
        $fileType = $file->getMimeType();
        $fileType = explode('/', $fileType);
        $fileType = $fileType[1];
        return uniqid() . '.' . $fileType;
    }

    /**
     * @param $file
     * @param $fileName
     * @param $dir
     * @return void
     */
    public function upload($file, $fileName, $dir): void
    {
        $file->move($this->appKernel->getProjectDir() . "/public/image/" . $dir . "/", $fileName);
    }

}