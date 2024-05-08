import React, { useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams hook
import Card from "@mui/material/Card";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import curved6 from "assets/images/curved-images/curved14.jpg";
import FileUpload from "../components/upload";

function SignUp() {
  const { userName, id } = useParams(); // Extract userName and id from URL params
  const [results, setResults] = useState([]);
  console.log(userName + " " + id);

  return (
    <BasicLayout
      title={userName} // Use userName from URL params as title
      description={`Welcome ${userName}! Here, you can easily upload your documents for submission. Our user-friendly interface ensures a smooth and hassle-free experience.`} // Use userName from URL params in description
      image={curved6}
    >
      <Card width="100px">
        <SoftBox p={3} mb={1} textAlign="center">
          <SoftTypography variant="h5" fontWeight="medium">
            Upload your files
          </SoftTypography>
        </SoftBox>

        <FileUpload style={{ flexGrow: 1, flexShrink: 1 }} candidatId={id} />
      </Card>
    </BasicLayout>
  );
}

export default SignUp;
