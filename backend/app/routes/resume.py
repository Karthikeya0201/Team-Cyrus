from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from typing import List
import json
from app.services.Parser import parse_job_description, parse_resume
from app.services.ResumeGenerator import generate_enhanced_resume
import os
from app.services.LatexCompiler import compile_latex_to_pdf  # Import the compiler service
import uuid
from app.services.ATS import calculate_matching_score

router = APIRouter()

@router.post("/enhance")
async def enhance_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    template_name: str = Form(...),
    additional_info:str = Form(...)
):
    print(file, job_description, template_name, additional_info)

    try:
        # Parse the current resume
        parsed_resume = await parse_resume(file)

        print(parsed_resume)
        parsed_job_description = await parse_job_description(job_description)
        print(parse_job_description)

        with open("templates/tex.json", "r") as f:
            templates = json.load(f)["templates"]
        
        template_file = next(
            (t["fileName"] for t in templates if t["name"] == template_name),
            "1.tex"  # Default template
        )


        print(template_file)
        # Generate enhanced resume
        result = await generate_enhanced_resume(
            parsed_resume=parsed_resume,
            job_description=parsed_job_description,
            template_file=template_file,
            additional_info=additional_info
        )

        print(result)
        # Compile LaTeX to PDF
        latex_code = result["latex_code"]  # Extract LaTeX code from the dictionary
        print(latex_code)

        pdf_path = await compile_latex_to_pdf(latex_code, f"resume_{uuid.uuid4()}.pdf")

        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename="enhanced_resume.pdf"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ats")
async def ats_analysis(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        # Parse the current resume
        candidate_profile = await parse_resume(file)

        # Parse the job description
        job_requirements = await parse_job_description(job_description)

        # Calculate matching score
        matching_score = await calculate_matching_score(
            job_requirements=job_requirements,
            candidate_profile=candidate_profile
        )

        return matching_score

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))