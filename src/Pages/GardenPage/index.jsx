import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/Auth.Context";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  cn,
  useDisclosure,
  Avatar,
  User,
  Chip,
  Tooltip,
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";

import { AddNoteIcon } from "../../Components/Listbox/dropmenu/AddNoteIcon";
import { CopyDocumentIcon } from "../../Components/Listbox/dropmenu/CopyDocumentIcon";
import { EditDocumentIcon } from "../../Components/Listbox/dropmenu/EditDocumentIcon";
import { DeleteDocumentIcon } from "../../Components/Listbox/dropmenu/DeleteDocumentIcon";
import DeleteGardenModal from "../../Components/DeleteGardenModal";
import ChangePlantNameModal from "../../Components/ChangePlantNameModal";
import ChangePlantImageModal from "../../Components/ChangePlantImageModal";
import PlantDetailsModal from "../../Components/PlantDetailsModal";
import  EditNotesModal from "../../Components/EditNotesModal";
import { useNavigate } from "react-router-dom";
const API_URL = "http://localhost:5005";
const iconClasses =
  "text-xl text-default-500 pointer-events-none flex-shrink-0";



function GardenPage() {
  const [garden, setGarden] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedPlant, setSelectedPlant] = useState(null); // Define selectedPlant
  const [openModal, setOpenModal] = useState(null); // State to track the open modal
  const [user, setUser] = useState(null);


  const navigate = useNavigate();
  const [values, setValues] = useState(new Set([]));

  const handleSelectionChange = (e) => {
    setValues(new Set(e.target.value.split(",")));
  };

   // Function to open a specific modal
   const openSpecificModal = (modalIdentifier, plant) => {
    setOpenModal(modalIdentifier);
    setSelectedPlant(plant); // Set selectedPlant
  };

  // Function to close the currently open modal
  const closeCurrentModal = () => {
    setOpenModal(null);
  };


  const fetchPlants = () => {
    const storedToken = localStorage.getItem("authToken");
     console.log(storedToken)

    axios
      .get(`${API_URL}/garden`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        setGarden(response.data.gardenPlants);
        setUser(response.data.currentUser);
      })
      .catch((error) =>
        console.log(
          "error while grabbing plants in user's garden from API: ",
          error
        )
      );
  };
  
  useEffect(() => {
    fetchPlants();
  }, []);

  function deletePlant(plantId) {
    const storedToken = localStorage.getItem("authToken");
    axios
      .delete(`${API_URL}/garden/${plantId}/delete`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then(() => {
        fetchPlants();
      })
      .catch((error) =>
        console.log(
          "error while deleting plant in user's garden from API: ",
          error
        )
      );
  }

  function changeName(name) {
    const storedToken = localStorage.getItem("authToken");
    const updatePlant = { commonName: updatedName };
    axios
      .put(`${API_URL}/garden/${plantId}/edit`, updatePlant)
      .then(() => navigate(`/garden`))
      .catch((err) => console.log(err));
  }

  function changeImage(image) {
    const storedToken = localStorage.getItem("authToken");
    if (updatedImage !== "") {
      const updatePlant = { imgUrl: updatedImage };
      axios
        .put(`${API_URL}/garden/${plantId}/edit`, updatePlant)
        .then(() => navigate(`/garden`))
        .catch((err) => console.log(err));
    } else {
      navigate(`/garden`);
    }
  }

  function changeNotes(notes) {
    const storedToken = localStorage.getItem("authToken");
    const updatePlant = { notes: updatedNotes };
    axios
      .put(`${API_URL}/garden/${plantId}/edit`, updatePlant)
      .then(() => navigate(`/garden`))
      .catch((err) => console.log(err));
  }

  function createSection() {
    const section = {
      title: sectionTitle,
      plants: sectionPlants,
    };
    const storedToken = localStorage.getItem("authToken");
    axios
      .post(`${API_URL}/garden/section/create`, section, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then(() => navigate("/garden"))
      .catch((err) => console.log(err));
  }
  
  return (
    <div>
      <h1>GardenPage</h1>
      <div className="noise-texture" ></div>
      {user && <div> <div>
      <img src={user.profilePicUrl} className="w-24 rounded-full" />
        <h1>{user.username}</h1>
        <h1>@{user.email}</h1>

      </div>
      <div>
        Description: {garden.description}
      </div>
      <div> 
        <Button onPress={onOpen} color="primary">
          Add a section
        </Button>
        <Button onPress={() => openSpecificModal("deleteGardenModal")}>Delete Garden</Button>
        <DeleteGardenModal
        isOpen={openModal === "deleteGardenModal"} // Check if this modal should be open
        onClose={closeCurrentModal} // Close the current modal
        identifier="deleteGardenModal" // Unique identifier/key for this modal
        fetchPlants={fetchPlants}
      />
       <ChangePlantNameModal
        isOpen={openModal === "ChangePlantNameModal"} // Check if this modal should be open
        onClose={closeCurrentModal} // Close the current modal
        identifier="ChangePlantNameModal" // Unique identifier/key for this modal
        fetchPlants={fetchPlants}
        selectedPlant={selectedPlant} // Pass selectedPlant
      />
       <ChangePlantImageModal
        isOpen={openModal === "ChangePlantImageModal"} // Check if this modal should be open
        onClose={closeCurrentModal} // Close the current modal
        identifier="ChangePlantImageModal" // Unique identifier/key for this modal
        fetchPlants={fetchPlants}
        selectedPlant={selectedPlant} // Pass selectedPlant
      />
          <PlantDetailsModal
        isOpen={openModal === "PlantDetailsModal"} // Check if this modal should be open
        onClose={closeCurrentModal} // Close the current modal
        identifier="PlantDetailsModal" // Unique identifier/key for this modal
        fetchPlants={fetchPlants}
        selectedPlant={selectedPlant} // Pass selectedPlant
      />
<EditNotesModal
        isOpen={openModal === "EditNotesModal"} // Check if this modal should be open
        onClose={closeCurrentModal} // Close the current modal
        identifier="EditNotesModal" // Unique identifier/key for this modal
        fetchPlants={fetchPlants}
        selectedPlant={selectedPlant} // Pass selectedPlant
      />
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <form onSubmit={() => createSection()}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Log in
                  </ModalHeader>
                  <ModalBody>
                    <Input
                      autoFocus
                      type="text"
                      name="sectionTitle"
                      placeholder="Section Name"
                      required="true"
                      variant="bordered"
                    />
                    {garden && (
                      <div className="flex w-full max-w-xs flex-col gap-2">
                        <Select
                          selectionMode="multiple"
                          name="sectionPlants"
                          placeholder="Select plants to add"
                          selectedKeys={values}
                          className="max-w-xs"
                          onChange={handleSelectionChange}
                        >
                          {garden.plants.map((plant) => (
                            <SelectItem
                              key={plant._id}
                              value={plant.commonName}
                            >
                              <div className="flex gap-2 items-center">
                                <Avatar
                                  className="flex-shrink-0"
                                  size="sm"
                                  src={plant.imgUrl}
                                />
                                <div className="flex flex-col">
                                  <span className="text-small">
                                    {plant.commonName}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </Select>
                        <p className="text-small text-default-500">
                          Selected: {Array.from(values).join(", ")}
                        </p>
                      </div>
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onPress={onClose}>
                      Sign in
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </form>
        </Modal>
      </div>
      <div className="flex-wrap flex flex-row p-10">
        {garden &&
          garden.plants.map((plant) => {
            return (
              <Tooltip
                key={plant._id}
                color="success"
                showArrow={true}
                content={plant.notes}
              >
                <Card
                  className="border-none m-1 w-56 "
                  key={plant._id}
                  isFooterBlurred
                  radius="lg"
                >

                   <div
    className="rounded-xl h-56 bg-cover bg-center"
    style={{ backgroundImage: `url(${plant.imgUrl})` }}
  ></div>
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-2 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">
                      {plant.commonName}
                    </p>

                    {/* drop menu */}
                    <Dropdown>
                      <DropdownTrigger>
                      <Button className="bg-black/10 hover:bg-black/30 outline: none text-white/100 hover:border-transparent" variant="flat" radius="lg" size="sm">Open</Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        variant="faded"
                        aria-label="Dropdown menu with description"
                      >
                        <DropdownSection title="Actions" showDivider>
                          <DropdownItem
                          onPress={() => openSpecificModal("PlantDetailsModal", plant)}
                            key="details"
                            description="Details"
                            startContent={
                              <CopyDocumentIcon className={iconClasses} />
                            }
                          >
                            View Details
                          </DropdownItem>
                          <DropdownItem
                            onPress={() => openSpecificModal("EditNotesModal", plant)}
                            key="note"
                            description="Create a note"
                            startContent={
                              <AddNoteIcon className={iconClasses} />
                            }
                          >
                            {plant.notes === "" ? "New note" : "Change note"}
                          </DropdownItem>
                          <DropdownItem
                            onPress={() => openSpecificModal("ChangePlantNameModal", plant)}
                            key="name"
                            description="Edit plant name"
                            startContent={
                              <EditDocumentIcon className={iconClasses} />
                            }
                          >
                            Change Name
                          </DropdownItem>
                          <DropdownItem
                            onPress={() => openSpecificModal("ChangePlantImageModal", plant)}
                            key="image"
                            description="Edit plant image"
                            startContent={
                              <EditDocumentIcon className={iconClasses} />
                            }
                          >
                            Change Image
                          </DropdownItem>
                        </DropdownSection>
                        <DropdownSection title="Danger zone">
                          <DropdownItem
                            onPress={() => deletePlant(plant._id)}
                            key="delete"
                            className="text-danger"
                            color="danger"
                            description="Permanently delete this plant"
                            startContent={
                              <DeleteDocumentIcon
                                className={cn(iconClasses, "text-danger")}
                              />
                            }
                          >
                            Delete file
                          </DropdownItem>
                        </DropdownSection>
                      </DropdownMenu>
                    </Dropdown>
                  </CardFooter>
                </Card>
              </Tooltip>
            );
          })}
      </div>
    </div>}
    </div>
  );
}

export default GardenPage;
