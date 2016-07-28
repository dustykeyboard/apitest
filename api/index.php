<?php

$apiToken = 'EXAMPLE-AUTH-TOKEN'; 

$response = array(
    'success' => false
);

if (!isset($_SERVER['HTTP_APITOKEN']) || ($_SERVER['HTTP_APITOKEN'] !== $apiToken)) {
    header('Content-Type: application/json');
    $response['Message'] = 'Missing or invalid API Token';
    echo json_encode($response);
    exit;
}

$type = $_REQUEST['type'];
$file = $type.'.json';
$data = [];
$nextId = 1;

if(file_exists($file)) {
    $data = json_decode(file_get_contents($file), true);
    $lastItem = end($data);
    $nextId = intval($lastItem['id'], 10) + 1;
}

switch($_SERVER['REQUEST_METHOD']) {
    // CREATE an item
    case 'POST':
            $input = file_get_contents( 'php://input', 'r' );
            $item = json_decode($input, true);

            // TODO: Validation

            if (!isset($item['id']) || !$item['id']) {
                $item['id'] = $nextId;
            }

            $data[] = $item;
            file_put_contents($file, json_encode($data));
            $response['success'] = true;
            $response[$type.'Id'] = $item['id']; 
        break;

    // READ item (all or by id)
    case 'GET':
        if (isset($_REQUEST['id'])) {
            foreach($data as $i => $item) {
                if ($_REQUEST['id'] == $item['id']) {
                    $response['success'] = true;
                    $response[$type] = [$item];
                    break;
                }
            }
        } else {
            $response['success'] = true;
            $response[$type] = $data;
        }

        if (!$response['success']) {
            $response['Message'] = 'Item not found';
        }
        break;
    
    // UPDATE an item
    case 'PUT':
        if (isset($_REQUEST['id'])) {
            $input = file_get_contents( 'php://input', 'r' );
            $updatedItem = json_decode($input, true);

            // TODO: Validation

            foreach($data as $i => $item) {
                if ($_REQUEST['id'] == $item['id']) {
                    // Ensure id doesn't change
                    $updatedItem['id'] = $item['id'];
                    $data[$i] = $updatedItem;
                    file_put_contents($file, json_encode($data));
                    $response['success'] = true;  
                }
            }
        } else {
            $response['Message'] = 'id not supplied';
        }
        break;

    // DELETE an item
    case 'DELETE':
        if (isset($_REQUEST['id'])) {

            // TODO: Validation

            foreach($data as $i => $item) {
                if ($_REQUEST['id'] == $item['id']) {
                    // Remove the item with matching id
                    array_splice($data, $i, 1);
                    file_put_contents($file, json_encode($data));
                    $response['success'] = true;  
                }
            }
        } else {
            $response['Message'] = 'id not supplied';
        }
        break;

}

// Artificial delay
sleep(1);

header('Content-Type: application/json');
echo json_encode($response);
